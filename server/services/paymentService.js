import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// Configuration des offres officielles (Section 3)
export const PRICING_PLANS = {
  decouverte: {
    id: "decouverte",
    name: "Découverte",
    priceFCFA: 0,
    priceEUR: 0,
    type: "gratuit",
    durationDays: 0,
    features: [
      "1 scan facial IA complet à vie",
      "Score global d'harmonie & liste des axes de progression",
      "Aperçu limité du programme",
      "Preview 'Maxé' en teasing flouté"
    ],
    isPopular: false
  },
  glow_up_30: {
    id: "glow_up_30",
    name: "Glow Up 30 Jours",
    priceFCFA: 3000,
    priceEUR: 4.5,
    type: "mensuel",
    durationDays: 30,
    features: [
      "Programme d'action complet 30 jours débloqué jour par jour",
      "Preview visuelle 'Glow Up Maxé' HD débloquée avec slider interactif",
      "Suivi photo hebdomadaire (J+7, J+14, J+21, J+28) avec calcul de delta",
      "Recettes complètes de parfums locaux & guide de composition",
      "Streaks de complétion, XP et déblocage de badges"
    ],
    isPopular: false
  },
  glow_up_90: {
    id: "glow_up_90",
    name: "Glow Up 90 Jours",
    priceFCFA: 7500,
    priceEUR: 11.5,
    type: "unique",
    durationDays: 90,
    badge: "Meilleure Valeur",
    features: [
      "Programme d'action approfondi 90 jours (Consolidation long terme)",
      "Toutes les fonctionnalités du pack 30 jours incluses",
      "Accès aux futures mises à jour vidéo des exercices (V2)",
      "Coaching personnalisé approfondi & Conseils morphologiques",
      "Accès prioritaire à la communauté VIP Looksmaxing Afrique"
    ],
    isPopular: true
  }
};

// Opérateurs Mobile Money supportés en Afrique francophone (Section 2 & 10)
export const PAYMENT_METHODS = [
  { id: "orange_money", name: "Orange Money", countries: ["Cameroun", "Côte d'Ivoire", "Sénégal", "Mali", "Guinée"], icon: "orange" },
  { id: "mtn_momo", name: "MTN Mobile Money", countries: ["Cameroun", "Côte d'Ivoire", "Bénin", "Congo"], icon: "yellow" },
  { id: "wave", name: "Wave", countries: ["Sénégal", "Côte d'Ivoire"], icon: "blue" },
  { id: "moov_money", name: "Moov Money", countries: ["Côte d'Ivoire", "Bénin", "Togo"], icon: "green" }
];

/**
 * Initialise une session de paiement Mobile Money
 */
export async function initiateMobileMoneyPayment({ planId, phoneNumber, operator, userEmail, country = "CI" }) {
  const plan = PRICING_PLANS[planId];
  if (!plan) {
    throw new Error(`Plan inconnu: ${planId}`);
  }

  const transactionId = `GLOW_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // Simulation / Préparation payload conforme CinetPay / FedaPay
  const paymentPayload = {
    transactionId,
    planId: plan.id,
    planName: plan.name,
    amount: plan.priceFCFA,
    currency: "XOF",
    phoneNumber,
    operator,
    userEmail,
    country,
    status: "PENDING",
    createdAt: new Date().toISOString()
  };

  return {
    success: true,
    transactionId,
    amount: plan.priceFCFA,
    currency: "FCFA",
    instructions: `Compose le code de validation sur ton téléphone ${phoneNumber} pour valider le débit de ${plan.priceFCFA} FCFA via ${operator}.`,
    paymentPayload
  };
}

/**
 * Vérifie la signature HMAC d'un webhook entrant (Sécurité obligatoire Section 10)
 */
export function verifyWebhookSignature(payload, signatureHeader, secretKey = process.env.PAYMENT_WEBHOOK_SECRET || 'glowup_default_secret_key') {
  if (!signatureHeader) return false;
  const hmac = crypto.createHmac('sha256', secretKey);
  const digest = hmac.update(typeof payload === 'string' ? payload : JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signatureHeader));
}
