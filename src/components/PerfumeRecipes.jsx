import React, { useState } from 'react';
import { Droplets, Sparkles, Flame, Shield, Info, CheckCircle2, Zap, Crown, Compass, Clock, HeartHandshake } from 'lucide-react';
import WaterRippleOverlay, { useWaterRipple } from './WaterDropEffect';

export default function PerfumeRecipes() {
  const [selectedRecipe, setSelectedRecipe] = useState('zeus');
  
  const zeusRipple = useWaterRipple();
  const achilleRipple = useWaterRipple();
  const empereurRipple = useWaterRipple();

  const recipes = [
    {
      id: 'zeus',
      icon: '⚡',
      name: "L'Odeur de Zeus",
      titleLong: "L'Odeur de Zeus — Puissance Foudroyante",
      occasion: "Soirées, conquête, dîners d'élite",
      family: "Oud Sombre • Poivre de Penja • Ambre Chaud",
      tag: "Magnétisme & Séduction",
      color: "#F59E0B",
      rippleHook: zeusRipple,
      auraDescription: "Le sillage d'un souverain qui impose le silence dès qu'il entre dans une pièce. Un accord brûlant, épicé et boisé qui envoûte les sens.",
      seductionScore: "9.9/10",
      longevity: "14h+",
      pyramid: {
        tete: "Poivre noir de Penja & Cardamome — Impact piquant immédiat",
        coeur: "Oud royal & Vétiver bourbon — Corps viril et texturé",
        fond: "Ambre chaud, Cuir noble & Musc noir — Sillage animal longue tenue"
      },
      composition: [
        { ingredient: "Poivre noir de Penja & Cardamome", percent: "35%" },
        { ingredient: "Oud royal & Vétiver bourbon", percent: "45%" },
        { ingredient: "Ambre chaud & Musc noir", percent: "20%" }
      ],
      ritual: "Vaporisez sur les points de pulsation : base du cou et revers de veste pour un sillage qui se diffuse à chaque pas."
    },
    {
      id: 'achille',
      icon: '⚔️',
      name: "Sillage d'Achille",
      titleLong: "Le Magnétisme d'Achille — Fraîcheur Divine",
      occasion: "Journée active, climat chaud urbain (Abidjan, Douala, Dakar)",
      family: "Hespéridé Solaire • Santal Velouté • Bergamote",
      tag: "Fraîcheur Alpha Pure",
      color: "#38BDF8",
      rippleHook: achilleRipple,
      auraDescription: "L'odeur d'un conquérant sous le soleil. Une explosion vivifiante d'agrumes nobles fusionnée à un santal crémeux anti-humidité.",
      seductionScore: "9.6/10",
      longevity: "10h+",
      pyramid: {
        tete: "Bergamote de Calabre & Cédrat vert — Fraîcheur vivifiante",
        coeur: "Santal doux & Bois de Gaïac — Chaleur veloutée rassurante",
        fond: "Musc végétal & Cèdre blanc — Fixateur net anti-chaleur"
      },
      composition: [
        { ingredient: "Bergamote noble & Cédrat", percent: "50%" },
        { ingredient: "Santal doux & Bois de Gaïac", percent: "35%" },
        { ingredient: "Musc végétal & Cèdre blanc", percent: "15%" }
      ],
      ritual: "3 sprays généreux : 1 de chaque côté du cou et 1 sur le torse avant d'enfiler votre chemise."
    },
    {
      id: 'empereur',
      icon: '👑',
      name: "L'Empereur",
      titleLong: "L'Empereur Silencieux — Aura de Haut Statut",
      occasion: "Affaires, rendez-vous stratégiques, soirées privées",
      family: "Fleur d'Oranger Royale • Musc Blanc • Cèdre",
      tag: "Haut Statut & Mystère",
      color: "#10B981",
      rippleHook: empereurRipple,
      auraDescription: "L'élégance suprême qui domine sans crier. Une aura aristocratique et propre qui attire irrésistiblement à moins d'un mètre.",
      seductionScore: "9.8/10",
      longevity: "12h+",
      pyramid: {
        tete: "Néroli pur & Fleur d'oranger — Propreté princière absolue",
        coeur: "Musc blanc royal & Cardamome — Texture soyeuse et intime",
        fond: "Cèdre de l'Atlas & Ambre gris — Ancrage noble et statutaire"
      },
      composition: [
        { ingredient: "Néroli pur & Fleur d'oranger", percent: "45%" },
        { ingredient: "Musc blanc royal doux", percent: "35%" },
        { ingredient: "Cèdre de l'Atlas & Ambre gris", percent: "20%" }
      ],
      ritual: "1 spray précis au creux de la pomme d'Adam et sur les poignets. Ne frottez jamais pour préserver les molécules."
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
    <div style={{ maxWidth: '680px', margin: '0 auto', paddingBottom: '20px' }}>
      {/* En-tête compact & haut de gamme */}
      <div className="glass-card" style={{ padding: '20px 16px', textAlign: 'center', marginBottom: '16px' }}>
        <div className="badge-gold" style={{ marginBottom: '8px', fontSize: '0.75rem' }}>
          <Sparkles size={13} />
          <span>Grooming Olfactif & Sillage Alpha</span>
        </div>

        <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.85rem)', marginBottom: '6px' }}>
          Formulations <span className="text-gold-gradient">Sillage Divin</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '500px', margin: '0 auto', lineHeight: '1.5' }}>
          Le parfum représente 50% de ton attraction invisible. Formule tes élixirs virils sur-mesure pour laisser une empreinte indélébile.
        </p>
      </div>

      {/* SÉLECTEUR D'ONGLETS MOBILE ERGONOMIQUE (SEGMENTED CONTROL) */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '8px', 
          marginBottom: '16px',
          background: 'rgba(11, 15, 25, 0.65)',
          padding: '5px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        {recipes.map(r => {
          const isSelected = selectedRecipe === r.id;
          return (
            <button
              key={r.id}
              className={`water-ripple-target`}
              onClick={(e) => handleSelectRecipe(r, e)}
              style={{
                position: 'relative',
                overflow: 'hidden',
                padding: '10px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                border: isSelected ? `1px solid ${r.color}` : '1px solid transparent',
                borderRadius: 'var(--radius-md)',
                color: isSelected ? '#FFF' : 'var(--text-muted)',
                background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                boxShadow: isSelected ? `0 0 20px ${r.color}35` : 'none',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              <WaterRippleOverlay ripples={r.rippleHook?.ripples} />
              <span style={{ fontSize: '1.15rem' }}>{r.icon}</span>
              <strong style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{r.name}</strong>
              <span style={{ fontSize: '0.65rem', color: isSelected ? r.color : 'var(--text-muted)', fontWeight: 700 }}>
                {r.tag.split('&')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* FICHE ÉLIXIR STRUCTURÉE ET LISIBLE */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '20px 16px', 
          borderColor: current.color, 
          boxShadow: `0 0 30px ${current.color}25` 
        }}
      >
        {/* Titre & Badges */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFF', margin: 0 }}>{current.titleLong}</h3>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span className="badge-gold" style={{ padding: '3px 8px', fontSize: '0.72rem', borderColor: current.color, color: current.color, background: `${current.color}15` }}>
                🔥 {current.seductionScore}
              </span>
              <span className="badge-emerald" style={{ padding: '3px 8px', fontSize: '0.72rem' }}>
                ⏱ Tenue {current.longevity}
              </span>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', color: current.color, fontWeight: 700 }}>
            {current.family}
          </span>
        </div>

        {/* Description / Citation courte */}
        <div 
          className="glass-surface" 
          style={{ 
            padding: '12px 14px', 
            marginBottom: '18px', 
            borderLeft: `3px solid ${current.color}`, 
            fontSize: '0.86rem', 
            lineHeight: '1.5', 
            fontStyle: 'italic', 
            color: 'var(--gold-100)' 
          }}
        >
          "{current.auraDescription}"
        </div>

        {/* Pyramide Olfactive Épurée */}
        <h4 style={{ fontSize: '0.95rem', color: 'var(--gold-200)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Crown size={15} color="var(--gold-400)" />
          <span>Pyramide Olfactive :</span>
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          <div className="glass-surface" style={{ padding: '9px 12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, background: 'rgba(255,255,255,0.08)', padding: '3px 6px', borderRadius: '4px', color: current.color }}>TÊTE</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{current.pyramid.tete}</span>
          </div>

          <div className="glass-surface" style={{ padding: '9px 12px', display: 'flex', gap: '10px', alignItems: 'center', borderColor: `${current.color}40` }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, background: `${current.color}15`, padding: '3px 6px', borderRadius: '4px', color: current.color }}>CŒUR</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>{current.pyramid.coeur}</span>
          </div>

          <div className="glass-surface" style={{ padding: '9px 12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, background: 'rgba(255,255,255,0.08)', padding: '3px 6px', borderRadius: '4px', color: current.color }}>FOND</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{current.pyramid.fond}</span>
          </div>
        </div>

        {/* Règle de Dosage & Application */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          <div className="glass-surface" style={{ padding: '10px 12px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 700 }}>DOSAGE IDÉAL</div>
            {current.composition.map((c, i) => (
              <div key={i} style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{c.ingredient.split('&')[0]}</span>
                <strong style={{ color: current.color }}>{c.percent}</strong>
              </div>
            ))}
          </div>

          <div className="glass-surface" style={{ padding: '10px 12px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 700 }}>RITUEL D'APPLICATION</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
              {current.ritual}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
