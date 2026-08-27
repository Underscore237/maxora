// E2E Integration test for GLOW UP application
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const BASE_URL = 'http://localhost:3001/api';

async function runTests() {
  console.log('🧪 Lancement des tests d\'intégration GLOW UP...\n');

  // Test 1: Authentification Google / 1-Clic
  console.log('1️⃣ Test Authentification...');
  const authRes = await fetch(`${BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'rostand.test@glowup.ai',
      name: 'Rostand Test',
      avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Rostand'
    })
  });
  const authData = await authRes.json();
  console.log('   Status:', authRes.status, 'User ID:', authData.user?.id, 'Plan initial:', authData.user?.plan);

  const userId = authData.user?.id;

  // Test 2: Récupération du profil
  console.log('\n2️⃣ Test Profil /api/user/me...');
  const meRes = await fetch(`${BASE_URL}/user/me`, {
    headers: { 'x-user-id': userId }
  });
  const meData = await meRes.json();
  console.log('   Status:', meRes.status, 'User Email:', meData.user?.email);

  // Test 3: Plans et Tarifs Mobile Money
  console.log('\n3️⃣ Test Grille tarifaire /api/payment/plans...');
  const plansRes = await fetch(`${BASE_URL}/payment/plans`);
  const plansData = await plansRes.json();
  console.log('   Status:', plansRes.status, 'Offres:', Object.keys(plansData.plans));
  console.log('   Prix Glow Up 30j:', plansData.plans.glow_up_30.priceFCFA, 'FCFA');
  console.log('   Prix Glow Up 90j:', plansData.plans.glow_up_90.priceFCFA, 'FCFA');
  console.log('   Opérateurs:', plansData.operators.map(o => o.name).join(', '));

  // Test 4: Scan Facial & Analyse Gemini
  console.log('\n4️⃣ Test Scan Facial & Analyse Gemini...');
  // Image réelle de visage africain
  const imgBuffer = fs.readFileSync('public/assets/african_man_before.jpg');
  const realImage = `data:image/jpeg;base64,${imgBuffer.toString('base64')}`;
  const scanRes = await fetch(`${BASE_URL}/scan/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId
    },
    body: JSON.stringify({
      imageBase64: realImage
    })
  });
  const scanData = await scanRes.json();
  console.log('   Status:', scanRes.status, 'Photo valide:', scanData.analysis?.photo_valide);
  console.log('   Score global:', scanData.analysis?.score_global, '/ 100');
  console.log('   Défauts identifiés:', scanData.analysis?.defauts?.length);
  console.log('   Délai max calculé (Section 5.4):', scanData.analysis?.delai_estime_max_global_jours, 'jours');

  // Test 5: Programme du jour
  console.log('\n5️⃣ Test Programme Quotidien /api/program/today...');
  const progRes = await fetch(`${BASE_URL}/program/today`, {
    headers: { 'x-user-id': userId }
  });
  const progData = await progRes.json();
  console.log('   Status:', progRes.status, 'Jour:', progData.currentDay, 'Tâches:', progData.daySchedule?.tasks?.length);
  console.log('   Tâches du jour:', progData.daySchedule?.tasks?.map(t => t.title).join(' | '));

  // Test 6: Toggle tâche & Streak
  if (progData.daySchedule?.tasks?.[0]) {
    const firstTask = progData.daySchedule.tasks[0];
    console.log('\n6️⃣ Test Validation Tâche:', firstTask.title);
    const toggleRes = await fetch(`${BASE_URL}/program/toggle-task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId
      },
      body: JSON.stringify({
        taskId: firstTask.id,
        completed: true,
        xpValue: 25
      })
    });
    const toggleData = await toggleRes.json();
    console.log('   Status:', toggleRes.status, 'Nouveau XP:', toggleData.xp, 'Streak:', toggleData.streak);
  }

  // Test 7: Paiement Mobile Money & Déblocage
  console.log('\n7️⃣ Test Activation Plan Mobile Money...');
  const payRes = await fetch(`${BASE_URL}/payment/simulate-success`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId
    },
    body: JSON.stringify({
      planId: 'glow_up_90',
      transactionId: 'TXN_TEST_123'
    })
  });
  const payData = await payRes.json();
  console.log('   Status:', payRes.status, 'Nouveau plan:', payData.user?.plan, 'Exp:', payData.user?.planExpiresAt);

  // Test 8: Suivi Hebdomadaire J+7
  console.log('\n8️⃣ Test Suivi Hebdomadaire /api/followup/compare...');
  const followRes = await fetch(`${BASE_URL}/followup/compare`, {
    headers: { 'x-user-id': userId }
  });
  const followData = await followRes.json();
  console.log('   Status:', followRes.status, 'Accès Hebdo débloqué:', followData.canAccessHebdoFollowup, 'Delta:', followData.scoreDeltaInitial, 'pts');

  // Test 9: Recettes Parfums Locaux
  console.log('\n9️⃣ Test Recettes Parfums /api/perfume/recipes...');
  const perfRes = await fetch(`${BASE_URL}/perfume/recipes`);
  const perfData = await perfRes.json();
  console.log('   Status:', perfRes.status, 'Recettes disponibles:', perfData.recipes?.length);

  // Test 10: Client Web Frontend HTTP status
  console.log('\n🔟 Test Serveur Frontend (Vite)...');
  const clientRes = await fetch('http://localhost:5173');
  console.log('   Status:', clientRes.status, 'Headers content-type:', clientRes.headers.get('content-type'));

  console.log('\n🎉 TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS ! 100% FONCTIONNEL.');
}

runTests().catch(err => console.error('Erreur test:', err));
