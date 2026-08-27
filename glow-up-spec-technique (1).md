# GLOW UP — Spécification technique complète
### Web app (PWA) de looksmaxing pour hommes africains francophones

---

## 1. Vue d'ensemble produit

**Positionnement :** application web permettant à un homme de scanner son visage via IA, de visualiser son "potentiel maximal" (preview visuelle sensationnelle mais crédible), d'obtenir un score détaillé de ses points faibles, puis de suivre un programme quotidien personnalisé (exercices faciaux, hygiène, alimentation, parfum) pour progresser réellement vers ce potentiel — avec suivi photo toutes les 7 jours.

**Ton :** motivant, jamais dénigrant. Jamais de vocabulaire toxique type "chad/subhuman". L'angle est la reprise en main, pas la honte.

**Marché cible :** hommes francophones d'Afrique (Cameroun, Côte d'Ivoire, Sénégal en priorité), via acquisition TikTok.

---

## 2. Stack technique

| Composant | Choix |
|---|---|
| Type d'app | Web app (PWA), pas de store au lancement |
| Authentification | Connexion Google (1 clic, pas de formulaire) |
| IA générale (analyse, scoring, texte, programme) | **Gemini API** |
| Génération d'image (preview "maxé") | **Qwen API** (image generation) — **fallback automatique sur Gemini API image** en cas d'échec/erreur/timeout |
| Paiement | Agrégateur **CinetPay ou FedaPay** (mobile money : Orange Money, MTN MoMo, Wave, Moov) — API directe opérateur envisageable en V2 une fois traction confirmée |
| Hébergement | À définir selon budget (Vercel/Railway/VPS + base de données) |
| Base de données | Utilisateurs, scans historiques, scores, abonnements, programme en cours |

### 2.1 Logique de fallback génération d'image

```
1. Appel Qwen API avec le prompt overlay (voir section 5.2)
2. Si erreur (timeout, échec de génération, contenu refusé) :
   → Retry une fois sur Qwen (avec un délai de 2-3s)
3. Si échec persistant :
   → Fallback automatique sur Gemini API (image generation)
   → Log l'incident pour monitoring (fréquence des fallbacks = indicateur de fiabilité Qwen)
4. Si les deux échouent :
   → Afficher un message d'erreur à l'utilisateur, ne pas décrémenter son quota de scan
```

---

## 3. Tarifs et modèle économique

| Offre | Prix | Contenu |
|---|---|---|
| **Découverte** | Gratuit | 1 scan à vie : score + aperçu limité du programme (pas de preview visuelle complète, pas de suivi hebdo) |
| **Glow Up 30 jours** | 3 000 FCFA/mois | Programme complet + preview "maxé" + suivi photo hebdo + recettes parfum |
| **Glow Up 90 jours** | 7 500 FCFA (paiement unique) | Idem + coaching approfondi + communauté VIP — badge "Meilleure valeur" |

**Règle de coût critique :** le scan gratuit ne donne PAS accès à la preview visuelle générée (coût API image le plus élevé) — uniquement au score textuel. La preview visuelle "maxé" est réservée aux abonnés payants, ou proposée en teasing flouté pour inciter à la conversion.

---

## 4. Funnel utilisateur complet

```
1. Landing page → CTA "Commence ton diagnostic gratuit"
        ↓
2. Connexion Google (1 clic)
        ↓
3. Upload photo (guidée : cadre facial à l'écran, conditions de luminosité)
        ↓
4. Validation photo (voir section 6) — rejet si non conforme, avec message clair
        ↓
5. Analyse IA (Gemini) → score global + scores par défaut (voir section 5.1)
        ↓
6. Preview "maxé" floutée/partielle (Qwen, fallback Gemini) → teasing
        ↓
7. PAYWALL → présentation des 3 offres
        ↓
8. Paiement (CinetPay/FedaPay) → déblocage preview complète + programme
        ↓
9. Programme quotidien débloqué jour par jour, adapté aux défauts identifiés
        ↓
10. Rappel J+7, J+14, etc. → nouvelle photo → nouveau score → comparaison/progression
```

---

## 5. Spec IA — Analyse et scoring

### 5.1 Prompt d'analyse faciale (Gemini API)

```
Tu es un système d'analyse d'harmonie faciale. Tu reçois une photo de visage.
Ta mission a 3 étapes strictes, dans cet ordre :

ÉTAPE 1 — MESURE (objective, pas de jugement esthétique)
Identifie et mesure les proportions structurelles du visage analysé :
- Symétrie gauche/droite (yeux, sourcils, coins de bouche, mâchoire)
- Ratio largeur/hauteur du visage
- Alignement de la ligne médiane (nez, philtrum, menton)
- Définition de la mâchoire et du contour (indépendamment de la morphologie
  de base — fin, carré, ovale, rond : chaque morphologie a SA version optimale,
  aucune n'est supérieure à une autre)
- État de la peau (texture, rougeurs, brillance liée à la rétention d'eau)
- Gonflement/rétention d'eau visible (bajoues, poches, contour flou)
- Densité et alignement de la pilosité faciale (barbe) si présente

ÉTAPE 2 — CALCUL DE L'AMÉLIORATION RÉALISTE (adaptatif, jamais générique)
Pour CE visage précis, détermine son propre "plafond réaliste" :
- Ne propose JAMAIS une structure osseuse différente (largeur mâchoire,
  position des yeux, forme du nez restent FIXES)
- Calcule uniquement les améliorations atteignables par des moyens non-invasifs :
  réduction de la rétention d'eau, meilleure définition par la perte de graisse
  faciale si pertinent, amélioration de la texture de peau, meilleur alignement
  postural (mewing), soin de la pilosité faciale/coiffure
- La cible d'amélioration doit toujours rester dans l'enveloppe de LA morphologie
  propre à ce visage, jamais vers un standard externe (pas de visage "type",
  pas de référence à une ethnicité, un genre de célébrité, ou un archétype)

ÉTAPE 3 — NOTATION ET RESTITUTION
Retourne un JSON strict au format suivant (voir schéma section 5.3).

CONTRAINTES ABSOLUES :
- Ne jamais comparer le visage à un "standard de beauté" figé ou à une autre personne
- Ne jamais mentionner de groupe ethnique, ni suggérer qu'une morphologie
  associée à une origine est "moins bien" qu'une autre
- Le ton des retours doit être motivant, jamais dévalorisant
  ("axe d'amélioration" plutôt que "défaut moche")
- Si l'image ne permet pas une mesure fiable (angle, luminosité, résolution,
  visage masqué), retourne photo_valide: false plutôt que d'halluciner un score
```

### 5.2 Prompt de génération d'image "maxé" (Qwen API, fallback Gemini)

**Version validée par test réel — dosage confirmé :**

```
Transforme ce visage pour montrer sa meilleure version possible, avec des
changements CLAIREMENT VISIBLES tout en gardant la personne reconnaissable
(même identité, mêmes yeux, même nez, même carnation).

Applique ces changements de façon visible et mesurable :
1. MÂCHOIRE : renforce nettement la définition et l'angle de la mâchoire,
   réduis le flou/gonflement sous le menton, augmente le contraste ombre/lumière
   sur le contour pour un effet "sculpté"
2. POMMETTES : rehausse et affine visiblement les pommettes, crée un léger
   creux sous-pommette pour plus de structure
3. PEAU : élimine toute rougeur, uniformise le teint, ajoute un éclat sain
   (effet "peau qui respire la santé"), réduis les pores visibles
4. SYMÉTRIE : corrige visiblement les asymétries entre le côté gauche et
   droit (yeux, sourcils, coins de bouche)
5. CONTOUR GÉNÉRAL : réduis la rétention d'eau/gonflement du visage pour un
   effet plus défini et moins arrondi, sans changer la morphologie osseuse
   de base
6. REGARD : intensifie légèrement le regard (blanc des yeux plus net,
   sourcils mieux définis)

Le résultat final doit produire un effet "avant/après glow up" immédiatement
perceptible par un spectateur externe en moins de 2 secondes, comparable à
un contenu de transformation viral TikTok — pas une retouche invisible.

NE PAS changer : la couleur de peau, la forme générale du visage (rond/ovale/
carré reste le même type), la position des yeux, la taille du nez, l'âge apparent.
```

**Note produit :** ce preview représente le "potentiel maximal long terme" (positionnement volontairement aspirationnel, pas une promesse à 90 jours précis). L'interface doit afficher un texte du type *"Ton potentiel maximal — le programme t'y rapproche chaque jour"* pour éviter toute confusion avec un délai garanti.

### 5.3 Schéma JSON de sortie (analyse)

```json
{
  "photo_valide": true,
  "raison_si_invalide": null,
  "score_global": 71,
  "defauts": [
    {
      "id": "jawline_definition",
      "defaut": "Définition du contour mâchoire",
      "score_actuel": 7,
      "score_potentiel_realiste_90j": 8,
      "cause_probable": "Légère rétention d'eau au niveau des joues",
      "categorie_action": "anti_retention_eau",
      "delai_estime_jours": 45
    },
    {
      "id": "skin_texture",
      "defaut": "Texture et éclat de peau",
      "score_actuel": 6,
      "score_potentiel_realiste_90j": 8,
      "cause_probable": "Exposition solaire sans protection, hydratation insuffisante",
      "categorie_action": "routine_peau",
      "delai_estime_jours": 60
    }
  ],
  "delai_estime_max_global_jours": 60,
  "message_utilisateur": null
}
```

**Catégories `categorie_action` possibles (mappées à la base d'exercices section 8) :**
`anti_retention_eau`, `routine_peau`, `definition_mâchoire`, `symetrie_posture`, `densite_barbe`, `hygiene_generale`, `parfum_grooming`

### 5.4 Table des délais par catégorie (fixée côté code, pas laissée à l'IA)

| Catégorie | Délai réaliste | Justification |
|---|---|---|
| Rétention d'eau / gonflement | 14-28 jours | Réponse rapide à l'hydratation/sodium |
| Texture de peau | 28-56 jours | Cycle de renouvellement cellulaire |
| Définition mâchoire (graisse faciale) | 56-84 jours | Dépend de la perte de graisse globale |
| Densité barbe/pilosité | 28-56 jours | Cycle de pousse pilaire |
| Posture/symétrie perçue (mewing) | 84+ jours | Changement structurel lent, progressif |

`delai_estime_max_global_jours = max(tous les délais individuels du visage analysé)`

---

## 6. Validation photo (avant analyse)

Rejeter ou avertir automatiquement si :
- Couvre-chef masquant le front/ligne de cheveux
- Angle de tête non-frontal (plongée, contre-plongée marquée)
- Éclairage dur avec ombres fortes, contre-jour
- Résolution insuffisante
- Visage partiellement hors cadre
- Lunettes de soleil, masque, main devant le visage

**Message type :** *"Retire ta casquette et prends la photo face à la lumière naturelle pour une analyse précise."*

---

## 7. Suivi hebdomadaire (J+7)

- Notification/rappel automatique à J+7 depuis le dernier scan
- Nouvelle photo → même pipeline de validation → nouvelle analyse
- Comparaison automatique : nouveau score vs score initial ET vs score précédent
- Affichage du delta ("+8 points depuis ta dernière photo")
- Génération d'un visuel avant/après partageable (moteur viral)
- **Réservé aux abonnés payants uniquement** (protection marge API)

---

## 8. Base d'exercices et recommandations par catégorie

> Chaque utilisateur reçoit un sous-ensemble de ce catalogue, sélectionné selon ses `categorie_action` détectées, réparti sur un programme jour-par-jour (voir section 9). Les vidéos d'illustration seront générées ultérieurement (prompt vidéo par exercice, à faire en V2).

### 8.1 Catégorie : Définition mâchoire / anti-graisse faciale

| Exercice | Description | Fréquence |
|---|---|---|
| Mewing (posture linguale) | Langue plaquée contre le palais, dents légèrement en contact, lèvres fermées, respiration nasale — à maintenir en continu tout au long de la journée | Permanent |
| Jaw clench léger | Contraction douce de la mâchoire tenue 10 secondes, relâchement, répéter | 3 séries de 10 reps/jour |
| Chin tucks (rétraction du menton) | Tirer le menton vers l'arrière (double menton volontaire), tenir 5 secondes | 3 séries de 15 reps/jour |
| Mastication de gomme sans sucre | Mâcher côté gauche puis côté droit alternativement | 10-15 min/jour |

### 8.2 Catégorie : Anti-rétention d'eau / gonflement

| Recommandation | Détail |
|---|---|
| Réduction sodium | Limiter les aliments très salés/transformés (bouillons cubes en excès, chips, conserves) |
| Hydratation régulière | Boire de l'eau tout au long de la journée plutôt qu'en une fois |
| Massage lymphatique facial | Mouvements doux du centre du visage vers les oreilles, puis le long du cou, matin et soir |
| Sommeil suffisant | Éviter les nuits trop courtes, qui favorisent la rétention et les poches |
| Éviter alcool en excès | Facteur de rétention d'eau et de gonflement facial |

### 8.3 Catégorie : Routine peau

| Étape | Détail | Fréquence |
|---|---|---|
| Nettoyage | Nettoyant doux adapté au type de peau (éviter le savon de Marseille classique, trop décapant) | Matin et soir |
| Hydratation | Crème hydratante légère non comédogène | Matin et soir |
| Protection solaire | SPF minimum 30, essentiel même en Afrique — anti-taches et anti-vieillissement | Matin |
| Exfoliation douce | Gommage léger pour retirer les cellules mortes | 1-2 fois/semaine |
| Produits locaux accessibles | Karité brut (hydratant naturel), savon noir africain (nettoyant doux), huile de coco (zones sèches) | Selon besoin |

### 8.4 Catégorie : Symétrie / posture (mewing avancé)

| Exercice | Description |
|---|---|
| Posture cervicale | Garder la tête alignée avec la colonne (éviter le "text neck" en regardant le téléphone vers le bas) |
| Étirement du cou | Étirements doux latéraux du cou, matin et soir |
| Mewing avec posture globale | Épaules basses et reculées, menton légèrement rentré, associé à la pratique du mewing |

### 8.5 Catégorie : Densité barbe / grooming pilosité

| Recommandation | Détail |
|---|---|
| Brossage quotidien | Brosse à barbe pour stimuler la pousse et discipliner le poil |
| Huile à barbe | Application quotidienne pour nourrir le poil et la peau sous-jacente |
| Entretien du contour | Rasage/taille régulière des contours (joues, cou) pour un rendu net |
| Alimentation favorable | Apport suffisant en protéines et hydratation générale (facteurs généraux de croissance pilaire) |

### 8.6 Catégorie : Hygiène générale

| Recommandation | Détail |
|---|---|
| Douche quotidienne | Avec attention particulière aux zones à transpiration (aisselles, plis) |
| Déodorant/antitranspirant | Application quotidienne, adapté au climat chaud |
| Hygiène dentaire | Brossage 2x/jour, fil dentaire, impact direct sur le sourire et l'haleine |
| Renouvellement du linge | Vêtements propres quotidiennement, attention particulière aux cols et bonnets |

### 8.7 Catégorie : Parfum / grooming olfactif

**Principe :** compositions "maison" accessibles avec ingrédients disponibles localement (huiles essentielles, alcool à parfum, essences).

| Profil | Composition suggérée | Occasion |
|---|---|---|
| Frais/quotidien | Base agrumes (citron, bergamote) + note boisée légère (santal) | Journée, climat chaud |
| Confiant/soirée | Base épicée (poivre noir, cardamome) + note boisée profonde (oud léger, vétiver) | Sortie, rendez-vous |
| Léger/discret | Base florale légère (fleur d'oranger) + musc blanc | Bureau, contexte formel |

*(Cette section sera enrichie avec des formulations précises en pourcentage lors du développement du module recettes.)*

---

## 9. Logique du programme quotidien

```
1. Après paiement, le système croise les `categorie_action` détectées 
   avec la base d'exercices (section 8)
2. Génère un calendrier de 30 ou 90 jours qui répartit :
   - Les actions à fréquence quotidienne (mewing, hydratation, routine peau) 
     dès le jour 1
   - Les actions progressives introduites par paliers (semaine 1: bases, 
     semaine 2: routine peau avancée, semaine 3+: grooming/parfum)
3. Chaque jour, l'utilisateur ne voit QUE les tâches du jour courant 
   (pas tout le programme d'un coup — logique de rétention)
4. Checklist quotidienne cochable, avec streaks et badges de complétion
5. Jour de la semaine correspondant à J+7, J+14... → déclenche le rappel 
   de nouvelle photo (section 7)
```

---

## 10. Paiement — architecture

- Intégration API directe CinetPay ou FedaPay (SDK Node.js)
- Gestion de deux flux : paiement récurrent mensuel (Glow Up 30 jours) et paiement unique (Glow Up 90 jours)
- **Sécurité obligatoire :**
  - Validation systématique de la signature HMAC des webhooks de paiement
  - Clés API jamais stockées en clair (variables d'environnement)
  - Séparation stricte des environnements sandbox / production
- Gestion des échecs de paiement mobile money (fréquents) : retry automatique + notification à l'utilisateur

---

## 11. Roadmap de développement suggérée

| Phase | Contenu |
|---|---|
| **V1 — MVP** | Auth Google, upload photo, validation photo, analyse Gemini (scoring), paywall, paiement CinetPay/FedaPay, programme statique débloqué par jour |
| **V2** | Preview visuelle Qwen + fallback Gemini, suivi photo J+7 avec comparaison, streaks/badges |
| **V3** | Vidéos d'illustration des exercices, communauté/classement entre amis, notifications push |
| **V4** | App Android native (une fois traction confirmée), puis iOS |

---

## 12. Points de vigilance produit (rappels)

- Ne jamais laisser croire que la preview "maxé" est atteignable en 90 jours précis — toujours la présenter comme potentiel long terme
- Réserver la preview complète et le suivi hebdo aux abonnés payants (protection marge API)
- Garder un ton motivant partout, jamais de vocabulaire dénigrant
- Standardiser les conditions de prise de photo pour garantir la fiabilité du score dans le temps
- Ne jamais faire dépendre le scoring d'un standard ethnique ou d'un archétype externe — toujours adaptatif à la morphologie propre du visage analysé
