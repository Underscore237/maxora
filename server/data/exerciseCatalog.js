// Catalogue complet des exercices et recommandations GLOW UP
// Adapté aux hommes africains francophones (Section 8 de la spécification technique)

export const EXERCISE_CATALOG = {
  definition_mâchoire: {
    name: "Définition Mâchoire & Anti-Graisse",
    category: "definition_mâchoire",
    icon: "Square",
    color: "#D4AF37",
    items: [
      {
        id: "mewing_posture",
        title: "Mewing (Posture linguale optimale)",
        frequency: "Permanent tout au long de la journée",
        duration: "Continu",
        difficulty: "Essentiel",
        description: "Plaquer l'intégralité de la langue contre le palais (pas seulement la pointe, mais aussi le tiers postérieur). Garder les lèvres doucement fermées, les dents en léger contact sans serrer, et respirer exclusivement par le nez.",
        tips: "Astuce : Prononcez 'N' ou déglutissez votre salive pour trouver le contact naturel du fond de la langue sur le palais.",
        impact: "Redéfinit l'angle cervico-mentonnier, structure les mâchoires et améliore la projection faciale à moyen/long terme."
      },
      {
        id: "chin_tucks",
        title: "Chin Tucks (Rétraction du menton)",
        frequency: "3 séries de 15 répétitions / jour",
        duration: "5 min",
        difficulty: "Facile",
        description: "Debout ou assis le dos droit, rentrez le menton vers l'arrière comme pour créer un double menton volontaire, sans baisser la tête. Maintenez 5 secondes, relâchez doucement.",
        tips: "Gardez le regard droit à l'horizon. Ne penchez pas la tête vers le bas.",
        impact: "Renforce les muscles fléchisseurs profonds du cou et améliore immédiatement la posture de la mâchoire."
      },
      {
        id: "jaw_clench_controle",
        title: "Jaw Clench Léger & Contrôlé",
        frequency: "3 séries de 10 répétitions / jour",
        duration: "3 min",
        difficulty: "Intermédiaire",
        description: "Contraction douce des muscles masséters pendant 10 secondes, puis relâchement complet pendant 5 secondes. Répétez 10 fois.",
        tips: "Ne serrez pas brutalement pour protéger vos articulations temporo-mandibulaires (ATM).",
        impact: "Tonifie et densifie les muscles masséters pour un contour plus marqué."
      },
      {
        id: "mastication_alternee",
        title: "Mastication alternée de gomme sans sucre",
        frequency: "10-15 minutes / jour",
        duration: "15 min",
        difficulty: "Facile",
        description: "Mâchez une gomme sans sucre dense en alternant 2 minutes côté gauche, puis 2 minutes côté droit pour préserver une symétrie parfaite.",
        tips: "Ne dépassez pas 20 minutes par jour pour éviter la fatigue articulaire.",
        impact: "Stimule la musculature masticatoire et affine la zone sous-maxillaire."
      }
    ]
  },

  anti_retention_eau: {
    name: "Anti-Rétention d'Eau & Décongestion",
    category: "anti_retention_eau",
    icon: "Droplets",
    color: "#38BDF8",
    items: [
      {
        id: "massage_lymphatique",
        title: "Massage lymphatique décongestionnant",
        frequency: "Matin au réveil et soir",
        duration: "4 min",
        difficulty: "Facile",
        description: "Appliquez quelques gouttes d'huile ou nettoyant, puis effectuez des mouvements doux et fermes depuis le centre du menton le long de la mâchoire vers les lobes d'oreilles, puis descendez le long du cou vers les clavicules.",
        tips: "Le drainage doit toujours aller vers le bas pour évacuer les toxines et la lymphe accumulée la nuit.",
        impact: "Élimine les bajoues et le gonflement matinal en moins de 10 minutes."
      },
      {
        id: "hydratation_optimale",
        title: "Protocole d'hydratation ciblée (2.5L à 3L)",
        frequency: "Tout au long de la journée",
        duration: "Continu",
        difficulty: "Essentiel",
        description: "Boire 500ml d'eau tiède/fraîche dès le réveil, puis répartir 2.5L à 3L d'eau par prises de 250ml tout au long de la journée.",
        tips: "Le corps retient l'eau quand il est déshydraté. Boire régulièrement force le corps à évacuer l'eau sous-cutanée excédentaire.",
        impact: "Affinement visible des joues et diminution radicale des cernes."
      },
      {
        id: "reduction_sodium",
        title: "Régulation du sodium & bouillons concentrés",
        frequency: "Chaque repas",
        duration: "Quotidien",
        difficulty: "Intermédiaire",
        description: "Modérez l'utilisation des cubes d'assaisonnement ultra-salés et sauces industrielles. Privilégiez les épices naturelles (poivre de Penja, gingembre, ail, piment, thym).",
        tips: "1 gramme de sel retient jusqu'à 200ml d'eau sous la peau du visage.",
        impact: "Diminution du visage bouffi en 48h à 72h chrono."
      },
      {
        id: "sommeil_sur_eleve",
        title: "Sommeil réparateur (7h-8h) avec oreiller adapté",
        frequency: "Chaque nuit",
        duration: "7-8h",
        difficulty: "Essentiel",
        description: "Dormez dans une pièce aérée avec la tête légèrement surélevée pour empêcher la stagnation des fluides dans le visage.",
        tips: "Évitez les écrans 30 minutes avant de dormir.",
        impact: "Évite l'effet visage gonflé au réveil et illumine le regard."
      }
    ]
  },

  routine_peau: {
    name: "Routine Peau & Éclat Naturel",
    category: "routine_peau",
    icon: "Sparkles",
    color: "#10B981",
    items: [
      {
        id: "nettoyage_savon_noir",
        title: "Nettoyage doux (Savon noir africain ou gel purifiant)",
        frequency: "Matin et soir",
        duration: "2 min",
        difficulty: "Facile",
        description: "Faire mousser délicatement sur peau humide. Nettoyer en mouvements circulaires sans frotter agressivement, puis rincer à l'eau fraîche.",
        tips: "Le vrai savon noir africain est riche en vitamines A et E. Évitez les savons ultra-décapants qui provoquent un effet rebond sébum.",
        impact: "Élimine l'excès de sébum, débouche les pores et prévient les boutons sous la barbe."
      },
      {
        id: "hydratation_karite_leger",
        title: "Hydratation naturelle au Beurre de Karité brut",
        frequency: "Matin et soir après le nettoyage",
        duration: "2 min",
        difficulty: "Facile",
        description: "Chauffer une noisette de beurre de karité pur (ou crème légère non comédogène) dans le creux des mains, puis appliquer par tapotements légers sur le visage.",
        tips: "Le karité nourrit la barrière lipidique et protège la peau de la déshydratation sous climat chaud.",
        impact: "Teint satiné, peau lisse, élastique et protégée."
      },
      {
        id: "protection_solaire_spf",
        title: "Protection solaire quotidienne SPF 30+",
        frequency: "Chaque matin avant de sortir",
        duration: "1 min",
        difficulty: "Essentiel",
        description: "Appliquer généreusement une protection solaire indice 30 à 50 adaptée aux peaux noires et mates (sans traces blanches).",
        tips: "Les UV sont le facteur n°1 des taches d'hyperpigmentation et du vieillissement prématuré.",
        impact: "Unifie le teint, élimine les taches sombres et donne un éclat durable."
      },
      {
        id: "exfoliation_douce",
        title: "Exfoliation douce (1 à 2 fois par semaine)",
        frequency: "Mercredi et Dimanche soir",
        duration: "3 min",
        difficulty: "Facile",
        description: "Gommage doux à grains fins ou exfoliant doux enzymatique pour éliminer les cellules mortes.",
        tips: "Ne jamais exfolier une peau irritée ou qui vient d'être rasée de près.",
        impact: "Texture de peau affinée, pores resserrés et éclat instantané."
      }
    ]
  },

  symetrie_posture: {
    name: "Symétrie & Posture Cervicale",
    category: "symetrie_posture",
    icon: "Maximize2",
    color: "#8B5CF6",
    items: [
      {
        id: "anti_text_neck",
        title: "Correction de la posture cervicale (Anti 'Text Neck')",
        frequency: "Tout au long de la journée",
        duration: "Continu",
        difficulty: "Intermédiaire",
        description: "Montez votre smartphone à la hauteur des yeux plutôt que de baisser la tête vers le torse. Gardez les oreilles alignées avec les épaules.",
        tips: "Chaque centimètre d'inclinaison vers l'avant ajoute 2 kg de pression sur les vertèbres cervicales.",
        impact: "Retend la peau sous le menton et redresse instantanément l'allure générale."
      },
      {
        id: "etirements_lateraux_cou",
        title: "Étirements latéraux & trapèzes",
        frequency: "Matin et soir",
        duration: "4 min",
        difficulty: "Facile",
        description: "Inclinez lentement la tête vers l'épaule droite pendant 20 secondes, puis vers la gauche. Répétez 3 fois de chaque côté.",
        tips: "Respirez profondément et ne forcez jamais sur les cervicales.",
        impact: "Rééquilibre les tensions musculaires asymétriques du visage et du cou."
      },
      {
        id: "mewing_posture_globale",
        title: "Posture d'ancrage Alpha (Épaules basses, buste ouvert)",
        frequency: "En marchant et en position assise",
        duration: "Continu",
        difficulty: "Intermédiaire",
        description: "Roulez les épaules vers l'arrière et vers le bas, ouvrez la cage thoracique, contractez légèrement le transverse abdominal.",
        tips: "Une posture alignée donne immédiatement l'impression d'un visage plus anguleux et confiant.",
        impact: "Amélioration globale de la présence et de la symétrie perçue."
      }
    ]
  },

  densite_barbe: {
    name: "Densité Barbe & Grooming Pilosité",
    category: "densite_barbe",
    icon: "Scissors",
    color: "#F59E0B",
    items: [
      {
        id: "brossage_quotidien_barbe",
        title: "Brossage régulier (Brosse poils naturels ou peigne bois)",
        frequency: "2 fois / jour (matin et soir)",
        duration: "2 min",
        difficulty: "Facile",
        description: "Brosser la barbe dans le sens du poil pour stimuler la micro-circulation sanguine à la racine du follicule.",
        tips: "Le brossage répartit le sébum naturel et dompte les frisottis des poils drus.",
        impact: "Densifie l'aspect visuel de la barbe et accélère la pousse."
      },
      {
        id: "huile_ricin_nourrissante",
        title: "Application Huile de Ricin & Jojoba",
        frequency: "Chaque soir",
        duration: "2 min",
        difficulty: "Facile",
        description: "Masser quelques gouttes d'huile de ricin mélangée à de l'huile de jojoba directement sur les zones clairsemées et sur toute la barbe.",
        tips: "L'acide ricinoléique de l'huile de ricin nourrit la kératine en profondeur.",
        impact: "Poils plus forts, plus denses et barbe brillante sans aspect gras."
      },
      {
        id: "tracage_contour_net",
        title: "Entretien du contour (Joues et Cou)",
        frequency: "Tous les 2 à 3 jours",
        duration: "5 min",
        difficulty: "Intermédiaire",
        description: "Définir la ligne du cou 1 à 2 doigts au-dessus de la pomme d'Adam. Tracer une ligne nette des favoris jusqu'au coin de la lèvre.",
        tips: "Un contour net donne l'illusion immédiate d'une mâchoire plus carrée et sculptée.",
        impact: "Effet 'sortie de barber' permanent qui structure le bas du visage."
      }
    ]
  },

  hygiene_generale: {
    name: "Hygiène Globale & Présence",
    category: "hygiene_generale",
    icon: "ShieldCheck",
    color: "#06B6D4",
    items: [
      {
        id: "douche_fraiche_tonique",
        title: "Douche tonique & zones de sudation",
        frequency: "Quotidien (matin et après effort)",
        duration: "7 min",
        difficulty: "Facile",
        description: "Insister sur les aisselles, le torse et les plis avec un savon antibactérien doux. Terminer par un jet d'eau fraîche pour resserrer les pores.",
        tips: "Séchez toujours soigneusement la peau avant d'appliquer tout produit.",
        impact: "Fraîcheur corporelle absolue et tonus musculaire."
      },
      {
        id: "hygiene_dentaire_sourire",
        title: "Hygiène bucco-dentaire & Sourire éclatant",
        frequency: "2 à 3 fois par jour",
        duration: "3 min",
        difficulty: "Facile",
        description: "Brossage consciencieux pendant 2 minutes + fil dentaire le soir + gratte-langue.",
        tips: "Un sourire éclatant et une haleine impeccable complètent 50% de l'attrait facial.",
        impact: "Dents plus lumineuses, gencives saines et confiance immédiate."
      },
      {
        id: "renouvellement_taies_oreillers",
        title: "Changement fréquent de la taie d'oreiller",
        frequency: "Tous les 3 à 4 jours",
        duration: "1 min",
        difficulty: "Facile",
        description: "Remplacer régulièrement sa taie d'oreiller (ou privilégier une taie en satin/soie).",
        tips: "La taie absorbe sébum et poussière la nuit, causant des micro-boutons.",
        impact: "Peau nette sans impuretés au réveil."
      }
    ]
  },

  parfum_grooming: {
    name: "Grooming Olfactif & Recettes Parfums Locaux",
    category: "parfum_grooming",
    icon: "Flame",
    color: "#EC4899",
    items: [
      {
        id: "parfum_frais_journee",
        title: "Signature Fraîche — Journée Climat Chaud",
        frequency: "Chaque matin",
        duration: "1 min",
        difficulty: "Facile",
        description: "Application sur les points de pulsation (derrière les oreilles, base du cou, poignets). Formule : 60% Agrumes (Bergamote, Citron vert), 30% Santal doux, 10% Alcool fin / huile porteuse.",
        tips: "Ne frottez pas les poignets entre eux pour ne pas briser les molécules aromatiques.",
        impact: "Sillage frais, énergisant et propre qui résiste à la chaleur toute la journée."
      },
      {
        id: "parfum_confident_soiree",
        title: "Signature Confiant & Magnétique — Soirée / Date",
        frequency: "Pour les sorties et rendez-vous",
        duration: "1 min",
        difficulty: "Facile",
        description: "Formule : Poivre noir de Penja / Cardamome (notes de tête épicées) + Cœur Vétiver terreux + Fond Oud léger et Ambre chaud.",
        tips: "Appliquez 2 sprays sur les vêtements (épaulettes de veste) pour une diffusion prolongée.",
        impact: "Aura mystérieuse, virile, inoubliable et séduisante."
      },
      {
        id: "parfum_business_discret",
        title: "Signature Élite & Business — Bureau / Formel",
        frequency: "Pour le travail et rendez-vous d'affaires",
        duration: "1 min",
        difficulty: "Facile",
        description: "Formule : Fleur d'oranger délicate + Musc blanc pur + Cèdre de l'Atlas.",
        tips: "Parfum subtil qui s'exprime uniquement à moins d'un mètre pour une élégance discrète.",
        impact: "Donne immédiatement une impression de rigueur, de propreté et de haut statut."
      }
    ]
  }
};
