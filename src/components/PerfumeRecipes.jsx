import React, { useState } from 'react';
import { Droplets, Sparkles, Flame, Shield, Info, CheckCircle2, Zap, Crown, Compass } from 'lucide-react';
import WaterRippleOverlay, { useWaterRipple } from './WaterDropEffect';

export default function PerfumeRecipes() {
  const [selectedRecipe, setSelectedRecipe] = useState('zeus');
  
  const zeusRipple = useWaterRipple();
  const achilleRipple = useWaterRipple();
  const empereurRipple = useWaterRipple();

  const recipes = [
    {
      id: 'zeus',
      name: "⚡ L'Odeur de Zeus — Puissance Foudroyante & Sillage Magnétique",
      titleShort: "L'Odeur de Zeus",
      occasion: "Soirées, rendez-vous galants, dîners d'élite, conquête",
      family: "Oud Sombre • Poivre de Penja • Ambre Chaud",
      tag: "Magnétisme Animal & Séduction",
      color: "#F59E0B",
      rippleHook: zeusRipple,
      auraDescription: "Le sillage d'un souverain qui impose le silence dès qu'il entre dans une pièce. Un accord brûlant, épicé et boisé qui envoûte les sens et laisse une empreinte inoubliable sur les peaux qu'il effleure.",
      seductionScore: "9.9 / 10",
      longevity: "14h+ sur les vêtements",
      pyramid: {
        tete: "Poivre noir de Penja (Cameroun) & Cardamome verte écrasée — Ouverture piquante et magnétique",
        coeur: "Oud précieux & Vétiver bourbon fumé — Corps viril, profond et texturé",
        fond: "Ambre chaud, Cuir noble & Musc noir — Sillage animal longue durée"
      },
      composition: [
        { ingredient: "Poivre noir de Penja & Cardamome", percent: "35%", role: "Notes de tête — L'impact magnétique immédiat" },
        { ingredient: "Oud royal & Vétiver bourbon", percent: "45%", role: "Notes de cœur — La signature virile et majestueuse" },
        { ingredient: "Ambre chaud & Musc noir profond", percent: "20%", role: "Notes de fond — La tenue hypnotique 14h+" }
      ],
      instructions: "Mélangez dans un flacon en verre ambré. Laissez reposer 72h dans un endroit sombre et frais pour une macération parfaite des épices.",
      ritual: "Vaporisez sur les points de pulsation chauds : la base des carotides (là où le sang pulse chaud) et sur les revers de chemise/veste pour un sillage qui se diffuse à chaque mouvement."
    },
    {
      id: 'achille',
      name: "⚔️ Le Magnétisme d'Achille — Fraîcheur Divine & Sillage Conquérant",
      titleShort: "Le Sillage d'Achille",
      occasion: "Journée active, climat chaud urbain (Abidjan, Douala, Dakar)",
      family: "Hespéridé Solaire • Santal Velouté • Bergamote",
      tag: "Fraîcheur Alpha Pure",
      color: "#38BDF8",
      rippleHook: achilleRipple,
      auraDescription: "L'odeur d'un conquérant victorieux sous le soleil ardent. Une explosion vivifiante d'agrumes nobles fusionnée à un santal velouté. Une fraîcheur éclatante qui résiste à l'humidité et inspire la confiance instantanée.",
      seductionScore: "9.6 / 10",
      longevity: "10h sous forte chaleur",
      pyramid: {
        tete: "Bergamote de Calabre, Citron vert & Cédrat vert — Fraîcheur glacée vivifiante",
        coeur: "Essence de Santal doux & Bois de Gaïac — Chaleur veloutée et rassurante",
        fond: "Musc végétal & Cèdre blanc — Fixateur net anti-transpiration"
      },
      composition: [
        { ingredient: "Bergamote noble & Cédrat vert", percent: "50%", role: "Notes de tête — Le choc de fraîcheur solaire" },
        { ingredient: "Santal doux & Bois de Gaïac", percent: "35%", role: "Notes de cœur — Le charisme propre et élégant" },
        { ingredient: "Musc végétal fin & Cèdre blanc", percent: "15%", role: "Notes de fond — La tenue anti-chaleur" }
      ],
      instructions: "Secouez doucement avant utilisation. À conserver au frais pour préserver les molécules hespéridées.",
      ritual: "3 pulvérisations généreuses : 1 sur chaque côté du cou et 1 spray sur le torse avant d'enfiler votre chemise."
    },
    {
      id: 'empereur',
      name: "👑 L'Empereur Silencieux — L'Aura Alpha Pure & Mystérieuse",
      titleShort: "L'Empereur Silencieux",
      occasion: "Affaires, rendez-vous stratégiques, soirées privées",
      family: "Fleur d'Oranger Royale • Musc Blanc • Cèdre Impérial",
      tag: "Haut Statut & Mystère",
      color: "#10B981",
      rippleHook: empereurRipple,
      auraDescription: "L'élégance suprême qui n'a pas besoin de crier pour dominer. Un parfum d'une netteté aristocratique qui attire irrésistiblement les personnes à moins d'un mètre de vous.",
      seductionScore: "9.8 / 10",
      longevity: "12h d'aura subtile",
      pyramid: {
        tete: "Néroli pur & Fleur d'oranger du Maroc — Propreté absolue, linge blanc princier",
        coeur: "Musc blanc doux & Cardamome blanche — Texture soyeuse et intime",
        fond: "Cèdre de l'Atlas & Ambre gris — Ancrage noble et statutaire"
      },
      composition: [
        { ingredient: "Néroli pur & Fleur d'oranger", percent: "45%", role: "Notes de tête — L'élégance aristocratique pure" },
        { ingredient: "Musc blanc royal doux", percent: "35%", role: "Notes de cœur — L'intimité séduisante à 1 mètre" },
        { ingredient: "Cèdre de l'Atlas & Ambre gris", percent: "20%", role: "Notes de fond — La signature haut statut" }
      ],
      instructions: "Idéal avec de l'huile de jojoba ou alcool neutre 90°. Laissez macérer 48h.",
      ritual: "1 spray précis au creux de la pomme d'Adam et sur les poignets. Ne frottez jamais les poignets pour ne pas briser la pyramide olfactive."
    }
  ];

  const current = recipes.find(r => r.id === selectedRecipe) || recipes[0];

  const handleSelectRecipe = (r, e) => {
    if (r.rippleHook) {
      r.rippleHook.triggerRipple(e, r.id === 'zeus' ? 'gold' : 'cyan');
    }
    setSelectedRecipe(r.id);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* En-tête de Prestige */}
      <div className="glass-card" style={{ padding: '28px 24px', textAlign: 'center', marginBottom: '24px' }}>
        <div className="badge-gold pulse-glow" style={{ marginBottom: '12px' }}>
          <Sparkles size={14} />
          <span>Grooming Olfactif & Sillage Sensationnel</span>
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>
          Formulations <span className="text-gold-gradient">Alpha & Sillage Divin</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '620px', margin: '0 auto', lineHeight: '1.6' }}>
          Le parfum est 50% de ton attraction invisible. Découvre comment formuler tes propres élixirs maison avec les trésors olfactifs locaux (Poivre de Penja, Oud, Santal, Néroli) pour <strong>laisser une trace indélébile</strong>.
        </p>
      </div>

      {/* Onglets des Formulations avec Ondulation d'Eau Douce Localisée */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {recipes.map(r => {
          const isSelected = selectedRecipe === r.id;
          return (
            <button
              key={r.id}
              className={`btn-secondary water-ripple-target ${isSelected ? 'selected' : ''}`}
              onClick={(e) => handleSelectRecipe(r, e)}
              style={{
                position: 'relative',
                overflow: 'hidden',
                padding: '14px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                borderColor: isSelected ? r.color : 'var(--border-subtle)',
                color: isSelected ? '#FFF' : 'var(--text-secondary)',
                boxShadow: isSelected ? `0 0 25px ${r.color}40` : 'none',
                background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent'
              }}
            >
              {/* Ondulation douce confinée à cet onglet */}
              <WaterRippleOverlay ripples={r.rippleHook?.ripples} />

              <span style={{ fontSize: '1.2rem', position: 'relative', zIndex: 2 }}>{r.name.substring(0, 2)}</span>
              <strong style={{ fontSize: '0.85rem', position: 'relative', zIndex: 2 }}>{r.titleShort}</strong>
              <span style={{ fontSize: '0.7rem', color: r.color, fontWeight: 800, position: 'relative', zIndex: 2 }}>
                {r.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* CARTE D'ÉLIXIR DÉTAILLÉE */}
      <div className="glass-card" style={{ padding: '30px 24px', borderColor: current.color, boxShadow: `0 0 35px ${current.color}30` }}>
        {/* Titre et Badges de Pouvoir */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '4px' }}>{current.name}</h3>
            <span style={{ fontSize: '0.88rem', color: current.color, fontWeight: 800 }}>
              {current.family}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="badge-gold" style={{ borderColor: current.color, color: current.color, background: `${current.color}15` }}>
              🔥 Séduction : {current.seductionScore}
            </div>
            <div className="badge-emerald">
              ⏱ Tenue : {current.longevity}
            </div>
          </div>
        </div>

        {/* Aura & Description Sensuelle */}
        <div className="glass-surface" style={{ padding: '16px 18px', marginBottom: '24px', borderLeft: `4px solid ${current.color}`, fontSize: '0.92rem', lineHeight: '1.6', fontStyle: 'italic', color: 'var(--gold-100)' }}>
          "{current.auraDescription}"
        </div>

        {/* PYRAMIDE OLFACTIVE VISUELLE */}
        <h4 style={{ fontSize: '1.05rem', color: 'var(--gold-200)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Crown size={18} color="var(--gold-400)" />
          <span>La Pyramide Olfactive du Charisme :</span>
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px' }}>
          <div className="glass-surface" style={{ padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 900, background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '6px', color: current.color }}>TÊTE</span>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>{current.pyramid.tete}</span>
          </div>

          <div className="glass-surface" style={{ padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'center', borderColor: `${current.color}50` }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 900, background: `${current.color}20`, padding: '4px 8px', borderRadius: '6px', color: current.color }}>CŒUR</span>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: 600 }}>{current.pyramid.coeur}</span>
          </div>

          <div className="glass-surface" style={{ padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 900, background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '6px', color: current.color }}>FOND</span>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>{current.pyramid.fond}</span>
          </div>
        </div>

        {/* DOSAGES EN POURCENTAGE */}
        <h4 style={{ fontSize: '1.05rem', color: 'var(--gold-200)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Droplets size={18} color={current.color} />
          <span>Formulation & Dosage Précis (pour flacon de 30ml) :</span>
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px' }}>
          {current.composition.map((c, i) => (
            <div key={i} className="glass-surface" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.94rem' }}>{c.ingredient}</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.role}</div>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: current.color, fontFamily: 'var(--font-display)' }}>
                {c.percent}
              </div>
            </div>
          ))}
        </div>

        {/* RITUEL DE DIFFUSION ET POINTS DE PULSATION */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
          <div className="glass-surface" style={{ padding: '16px', fontSize: '0.86rem' }}>
            <strong style={{ color: 'var(--gold-300)', display: 'block', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🧪 Maturation Optimale :
            </strong>
            {current.instructions}
          </div>

          <div className="glass-surface" style={{ padding: '16px', fontSize: '0.86rem', borderColor: current.color }}>
            <strong style={{ color: current.color, display: 'block', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🔥 Rituel d'Application Sensationnel :
            </strong>
            {current.ritual}
          </div>
        </div>
      </div>
    </div>
  );
}
