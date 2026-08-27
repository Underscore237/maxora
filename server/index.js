import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeFacialPhoto } from './services/geminiService.js';
import { generateMaxedGlowUpImage, fallbackMetrics } from './services/qwenImageService.js';
import { generateUserProgram } from './services/programGenerator.js';
import { PRICING_PLANS, initiateMobileMoneyPayment, PAYMENT_METHODS } from './services/paymentService.js';
import { EXERCISE_CATALOG } from './data/exerciseCatalog.js';
import { getOrCreateUser, updateUser, saveScan, getUserScans, readDb, writeDb } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware pour identifier l'utilisateur courant (via en-tête ou default)
app.use((req, res, next) => {
  const userId = req.headers['x-user-id'] || 'guest_user_1';
  req.userId = userId;
  next();
});

// ==========================================
// 1. AUTHENTIFICATION & UTILISATEUR
// ==========================================

// Authentification 1-clic Google ou Démo
app.post('/api/auth/google', (req, res) => {
  const { credential, email, name, avatar } = req.body;
  const userId = email ? email.replace(/[^a-zA-Z0-9]/g, '_') : 'champion_user';
  
  const user = getOrCreateUser(userId, {
    email: email || 'champion@glowup.ai',
    name: name || 'Frère Glow Up',
    avatar: avatar || null
  });

  res.json({ success: true, user });
});

// Récupération du profil courant
app.get('/api/user/me', (req, res) => {
  const user = getOrCreateUser(req.userId);
  const scans = getUserScans(req.userId);
  res.json({ user, scansCount: scans.length, latestScan: scans[scans.length - 1] || null });
});

// ==========================================
// 2. SCAN FACIAL & ANALYSE GEMINI
// ==========================================

app.post('/api/scan/analyze', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image requise pour le scan' });
    }

    const user = getOrCreateUser(req.userId);

    // Règle de coût critique (Section 3) :
    // Si l'utilisateur est gratuit et a déjà fait son scan gratuit, on vérifie
    if (user.plan === 'decouverte' && user.scanCount >= 1 && user.scansHistory?.length > 0) {
      // Pour une démo sans friction, on permet de ré-analyser mais on rappelle le paywall
    }

    // Appel au service Gemini
    const analysis = await analyzeFacialPhoto(imageBase64, mimeType);

    if (!analysis.photo_valide) {
      return res.status(422).json({
        photo_valide: false,
        raison_si_invalide: analysis.raison_si_invalide || "Photo non conforme. Cadre bien ton visage face à la lumière naturelle."
      });
    }

    // Extraction des catégories d'action
    const detectedCategories = (analysis.defauts || []).map(d => d.categorie_action);

    // Génération ou mise à jour du programme personnalisé si l'utilisateur n'en a pas
    const programDuration = user.plan === 'glow_up_90' ? 90 : 30;
    const personalizedProgram = generateUserProgram(detectedCategories, programDuration);

    // Enregistrement du scan
    const savedScan = saveScan(req.userId, {
      imageBase64: imageBase64.substring(0, 300) + '...', // aperçu léger en log
      score_global: analysis.score_global,
      defauts: analysis.defauts,
      delai_estime_max_global_jours: analysis.delai_estime_max_global_jours,
      message_utilisateur: analysis.message_utilisateur,
      detectedCategories,
      fullImageStored: imageBase64
    });

    // Mise à jour du programme utilisateur dans la base
    updateUser(req.userId, {
      program: personalizedProgram,
      latestScanId: savedScan.id
    });

    res.json({
      success: true,
      scanId: savedScan.id,
      analysis,
      userPlan: user.plan
    });

  } catch (error) {
    console.error('Erreur scan analyze:', error);
    res.status(500).json({ error: 'Erreur lors de l\'analyse faciale: ' + error.message });
  }
});

// ==========================================
// 3. GÉNÉRATION IMAGE "MAXÉ" (QWEN + GEMINI FALLBACK)
// ==========================================

app.post('/api/scan/generate-maxed', async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    const user = getOrCreateUser(req.userId);

    // Règle de coût critique (Section 3 & 5.1) :
    // La preview complète nette est réservée aux abonnés payants
    const isPaid = user.plan === 'glow_up_30' || user.plan === 'glow_up_90';

    const result = await generateMaxedGlowUpImage(imageBase64);

    res.json({
      success: true,
      result,
      isTeasingOnly: !isPaid,
      disclaimer: "Ton potentiel maximal long terme — Le programme quotidien t'en rapproche chaque jour."
    });

  } catch (error) {
    console.error('Erreur génération maxé:', error);
    res.status(500).json({ error: 'Échec de la génération maxé: ' + error.message });
  }
});

// ==========================================
// 4. PROGRAMME QUOTIDIEN JOUR PAR JOUR (Section 9)
// ==========================================

app.get('/api/program/today', (req, res) => {
  const user = getOrCreateUser(req.userId);

  if (!user.program) {
    // Générer un programme par défaut si pas encore initialisé
    user.program = generateUserProgram([], user.plan === 'glow_up_90' ? 90 : 30);
    updateUser(req.userId, { program: user.program });
  }

  const currentDay = user.currentDay || 1;
  const daySchedule = user.program[currentDay] || user.program[1];

  // Règle de rétention (Section 9) :
  // L'utilisateur ne voit que les tâches du jour courant
  res.json({
    currentDay,
    totalDays: user.plan === 'glow_up_90' ? 90 : 30,
    daySchedule,
    streak: user.streak || 0,
    xp: user.xp || 0,
    completedTasks: user.completedTasks || {},
    plan: user.plan
  });
});

app.post('/api/program/toggle-task', (req, res) => {
  const { taskId, completed, xpValue = 20 } = req.body;
  const user = getOrCreateUser(req.userId);

  const completedTasks = user.completedTasks || {};
  completedTasks[taskId] = completed;

  let newXp = (user.xp || 0) + (completed ? xpValue : -xpValue);
  if (newXp < 0) newXp = 0;

  // Calcul du streak si toutes les tâches du jour sont faites
  const currentDay = user.currentDay || 1;
  const daySchedule = user.program?.[currentDay];
  let streak = user.streak || 0;

  if (daySchedule && daySchedule.tasks) {
    const allDone = daySchedule.tasks.every(t => completedTasks[t.id]);
    if (allDone && !daySchedule.isCompleted) {
      daySchedule.isCompleted = true;
      streak += 1;
    }
  }

  updateUser(req.userId, {
    completedTasks,
    xp: newXp,
    streak,
    program: user.program
  });

  res.json({ success: true, completedTasks, xp: newXp, streak });
});

// Passer au jour suivant (pour tester ou naviguer)
app.post('/api/program/next-day', (req, res) => {
  const user = getOrCreateUser(req.userId);
  const maxDays = user.plan === 'glow_up_90' ? 90 : 30;
  const nextDay = Math.min((user.currentDay || 1) + 1, maxDays);
  updateUser(req.userId, { currentDay: nextDay });
  res.json({ success: true, currentDay: nextDay });
});

// ==========================================
// 5. PAIEMENT & MOBILE MONEY (Section 10)
// ==========================================

app.get('/api/payment/plans', (req, res) => {
  res.json({ plans: PRICING_PLANS, operators: PAYMENT_METHODS });
});

app.post('/api/payment/checkout', async (req, res) => {
  try {
    const { planId, phoneNumber, operator, country } = req.body;
    const user = getOrCreateUser(req.userId);

    const session = await initiateMobileMoneyPayment({
      planId,
      phoneNumber,
      operator,
      userEmail: user.email,
      country
    });

    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Simulation de validation de paiement (ou callback webhook)
app.post('/api/payment/simulate-success', (req, res) => {
  const { planId, transactionId } = req.body;
  const plan = PRICING_PLANS[planId];
  if (!plan) return res.status(400).json({ error: 'Plan invalide' });

  const durationDays = plan.durationDays || 30;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);

  const updatedUser = updateUser(req.userId, {
    plan: planId,
    planExpiresAt: expiresAt.toISOString()
  });

  res.json({
    success: true,
    message: `Paiement validé ! Votre accès au programme ${plan.name} est activé.`,
    user: updatedUser
  });
});

// ==========================================
// 6. SUIVI HEBDOMADAIRE J+7 / J+14 (Section 7)
// ==========================================

app.get('/api/followup/compare', (req, res) => {
  const user = getOrCreateUser(req.userId);
  const scans = getUserScans(req.userId);

  if (scans.length === 0) {
    return res.json({ hasFollowup: false, message: "Effectue ton premier scan pour activer le suivi." });
  }

  const initialScan = scans[0];
  const latestScan = scans[scans.length - 1];
  const previousScan = scans.length > 1 ? scans[scans.length - 2] : initialScan;

  const scoreDeltaInitial = (latestScan.score_global || 70) - (initialScan.score_global || 70);
  const scoreDeltaPrevious = (latestScan.score_global || 70) - (previousScan.score_global || 70);

  res.json({
    hasFollowup: scans.length >= 1,
    scansCount: scans.length,
    initialScan,
    latestScan,
    previousScan,
    scoreDeltaInitial,
    scoreDeltaPrevious,
    canAccessHebdoFollowup: user.plan === 'glow_up_30' || user.plan === 'glow_up_90',
    daysSinceInitial: Math.floor((new Date() - new Date(initialScan.createdAt)) / (1000 * 60 * 60 * 24))
  });
});

// ==========================================
// 7. RECETTES PARFUMS LOCAUX (Section 8.7)
// ==========================================

app.get('/api/perfume/recipes', (req, res) => {
  res.json({
    recipes: EXERCISE_CATALOG.parfum_grooming.items,
    catalog: EXERCISE_CATALOG
  });
});

// ==========================================
// 8. MONITORING ET FALLBACK STATS (Section 2.1)
// ==========================================

app.get('/api/metrics/fallbacks', (req, res) => {
  res.json(fallbackMetrics);
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`\n💎 Serveur GLOW UP démarré sur http://localhost:${PORT}`);
  console.log(`✨ API IA Gemini & Qwen/DashScope prêtes.`);
});
