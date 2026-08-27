// Table des délais par catégorie fixée côté code (Section 5.4 de la spécification)
// Ne doit JAMAIS être laissée à l'aléatoire de l'IA pour garantir la crédibilité du diagnostic.

export const CATEGORY_DELAYS = {
  anti_retention_eau: {
    minDays: 14,
    maxDays: 28,
    typicalDays: 21,
    justification: "Réponse rapide aux ajustements d'hydratation, de sommeil et de réduction du sodium."
  },
  routine_peau: {
    minDays: 28,
    maxDays: 56,
    typicalDays: 42,
    justification: "Cycle biologique complet de renouvellement cellulaire épidermique (28 jours par cycle)."
  },
  definition_mâchoire: {
    minDays: 56,
    maxDays: 84,
    typicalDays: 70,
    justification: "Dépend de la tonification des masséters et de la perte progressive de graisse faciale."
  },
  densite_barbe: {
    minDays: 28,
    maxDays: 56,
    typicalDays: 42,
    justification: "Cycle de pousse pilaire folliculaire et renforcement de la kératine."
  },
  symetrie_posture: {
    minDays: 84,
    maxDays: 90,
    typicalDays: 90,
    justification: "Adaptation neuromusculaire et rééquilibrage postural structurel lent et progressif."
  },
  hygiene_generale: {
    minDays: 7,
    maxDays: 14,
    typicalDays: 14,
    justification: "Impact immédiat sur la fraîcheur cutanée et le confort dès la première semaine."
  },
  parfum_grooming: {
    minDays: 7,
    maxDays: 14,
    typicalDays: 7,
    justification: "Maîtrise immédiate des formulations et du sillage personnalisé."
  }
};

/**
 * Calcule le délai estimé max global d'après les catégories identifiées
 * delai_estime_max_global_jours = max(tous les délais individuels du visage analysé)
 */
export function calculateMaxGlobalDelay(defauts) {
  if (!defauts || defauts.length === 0) return 30;

  let maxDelay = 0;
  for (const item of defauts) {
    const cat = item.categorie_action;
    const catDelay = CATEGORY_DELAYS[cat]?.typicalDays || item.delai_estime_jours || 30;
    // Règle de cohérence : mettre à jour le delai de chaque défaut si besoin
    item.delai_estime_jours = catDelay;
    if (catDelay > maxDelay) {
      maxDelay = catDelay;
    }
  }

  return maxDelay || 60;
}
