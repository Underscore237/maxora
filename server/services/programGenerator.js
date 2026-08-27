import { EXERCISE_CATALOG } from '../data/exerciseCatalog.js';

/**
 * Génère un programme personnalisé complet de 30 ou 90 jours
 * basé sur les catégories détectées lors du scan
 */
export function generateUserProgram(detectedCategories = [], totalDays = 30) {
  // Garantir au moins les catégories fondamentales si aucune n'est passée
  const activeCategories = new Set([
    'definition_mâchoire',
    'anti_retention_eau',
    'routine_peau',
    ...detectedCategories
  ]);

  // Ajouter parfum et hygiène pour enrichir le parcours global
  activeCategories.add('hygiene_generale');
  activeCategories.add('parfum_grooming');

  const program = {};

  for (let day = 1; day <= totalDays; day++) {
    const weekNumber = Math.ceil(day / 7);
    const dayOfWeek = ((day - 1) % 7) + 1; // 1 (Lundi) à 7 (Dimanche)
    const isPhotoFollowupDay = (day % 7 === 0);

    const dayTasks = [];

    // Phase 1 : Tâches fondamentales permanentes dès le Jour 1
    if (activeCategories.has('definition_mâchoire')) {
      dayTasks.push({
        id: `day_${day}_mewing`,
        title: "Mewing Actif (Posture linguale)",
        category: "definition_mâchoire",
        duration: "Continu",
        xp: 25,
        icon: "Square",
        description: "Langue plaquée contre le palais, respiration nasale exclusive, dents en contact léger.",
        completed: false
      });

      if (dayOfWeek % 2 === 1) { // 1 jour sur 2
        dayTasks.push({
          id: `day_${day}_chin_tucks`,
          title: "Chin Tucks & Masséters (3x15 reps)",
          category: "definition_mâchoire",
          duration: "5 min",
          xp: 20,
          icon: "ShieldCheck",
          description: "Rétraction du menton dos droit pour muscler les fléchisseurs du cou et tonifier l'angle maxillaire.",
          completed: false
        });
      }
    }

    if (activeCategories.has('anti_retention_eau')) {
      dayTasks.push({
        id: `day_${day}_hydratation`,
        title: "Protocole Hydratation 2.5L & Sodium régulé",
        category: "anti_retention_eau",
        duration: "Quotidien",
        xp: 20,
        icon: "Droplets",
        description: "Boire 500ml dès le réveil, limiter les cubes d'assaisonnement ultra-salés aux repas.",
        completed: false
      });

      if (weekNumber >= 2 || dayOfWeek === 1 || dayOfWeek === 4) {
        dayTasks.push({
          id: `day_${day}_massage_lymphatique`,
          title: "Massage lymphatique décongestionnant",
          category: "anti_retention_eau",
          duration: "4 min",
          xp: 25,
          icon: "Sparkles",
          description: "Drainage du menton vers les oreilles et le long du cou pour évacuer les gonflements.",
          completed: false
        });
      }
    }

    if (activeCategories.has('routine_peau')) {
      dayTasks.push({
        id: `day_${day}_nettoyage_karite`,
        title: "Nettoyage doux + Hydratation Karité / SPF 30+",
        category: "routine_peau",
        duration: "4 min",
        xp: 25,
        icon: "Sparkles",
        description: "Nettoyant doux ou savon noir, suivi d'une noisette de karité pur et protection solaire.",
        completed: false
      });

      // Exfoliation 2 fois par semaine (Mercredi / Dimanche)
      if (dayOfWeek === 3 || dayOfWeek === 7) {
        dayTasks.push({
          id: `day_${day}_exfoliation`,
          title: "Gommage & Exfoliation douce de la peau",
          category: "routine_peau",
          duration: "3 min",
          xp: 30,
          icon: "Sparkles",
          description: "Élimination douce des cellules mortes pour unifier le teint et désobstruer les pores.",
          completed: false
        });
      }
    }

    // Phase 2 : Posture et Barbe (progressif dès Semaine 2)
    if (weekNumber >= 2 && activeCategories.has('symetrie_posture')) {
      dayTasks.push({
        id: `day_${day}_posture_cervicale`,
        title: "Posture Alpha & Étirements Cervicaux",
        category: "symetrie_posture",
        duration: "4 min",
        xp: 20,
        icon: "Maximize2",
        description: "Épaules basses et reculées, téléphone monté au niveau des yeux pour éliminer le 'text neck'.",
        completed: false
      });
    }

    if (activeCategories.has('densite_barbe')) {
      if (dayOfWeek % 2 === 0) {
        dayTasks.push({
          id: `day_${day}_brossage_huile_barbe`,
          title: "Brossage barbe & Huile de ricin fortifiante",
          category: "densite_barbe",
          duration: "3 min",
          xp: 20,
          icon: "Scissors",
          description: "Stimulation sanguine au poil de sanglier et nutrition profonde des racines.",
          completed: false
        });
      }
    }

    // Phase 3 : Grooming & Parfum (dès Semaine 3 ou le week-end)
    if (weekNumber >= 3 || dayOfWeek === 6 || dayOfWeek === 7) {
      dayTasks.push({
        id: `day_${day}_parfum_signature`,
        title: "Application Parfum Signature (Points de pulsation)",
        category: "parfum_grooming",
        duration: "1 min",
        xp: 15,
        icon: "Flame",
        description: "Notes fraîches d'agrumes/santal en journée ou accord épicé/oud le soir sur la base du cou et poignets.",
        completed: false
      });
    }

    // Tâche spéciale de Suivi Photo Hebdomadaire (J+7, J+14, J+21, J+28...)
    if (isPhotoFollowupDay) {
      dayTasks.push({
        id: `day_${day}_scan_hebdo`,
        title: `📸 Scan de Suivi Hebdo (J+${day})`,
        category: "suivi_hebdo",
        duration: "2 min",
        xp: 100,
        icon: "Camera",
        isSpecial: true,
        description: "Prends ta photo de contrôle hebdomadaire dans les mêmes conditions lumineuses pour mesurer ton évolution et ton delta de points !",
        completed: false
      });
    }

    // Métadonnées du jour
    program[day] = {
      dayNumber: day,
      weekNumber: weekNumber,
      title: `Jour ${day} — ${getWeekFocusTitle(weekNumber)}`,
      focus: getWeekFocusDescription(weekNumber),
      isPhotoFollowupDay: isPhotoFollowupDay,
      tasks: dayTasks,
      totalXp: dayTasks.reduce((sum, t) => sum + t.xp, 0),
      isCompleted: false
    };
  }

  return program;
}

function getWeekFocusTitle(weekNumber) {
  switch (weekNumber) {
    case 1: return "Activation des Fondations (Mewing & Hydratation)";
    case 2: return "Décongestion & Routine Peau Avancée";
    case 3: return "Sculpture Mandibulaire & Posture Alpha";
    case 4: return "Grooming Élite & Signature Olfactive";
    default: return "Consolidation & Potentiel Maximal";
  }
}

function getWeekFocusDescription(weekNumber) {
  switch (weekNumber) {
    case 1: return "Mise en place de la posture linguale réflexe et purge de l'eau sous-cutanée excédentaire.";
    case 2: return "Élimination des bajoues par massage lymphatique et restauration de l'éclat du teint.";
    case 3: return "Renforcement des masséters, correction cervicale et traçage net des contours.";
    case 4: return "Élévation globale de la présence, sillage de parfum longue durée et perfectionnement.";
    default: return "Ancrage des habitudes automatiques pour maintenir ton plein potentiel esthétique.";
  }
}
