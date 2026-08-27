import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Clock, AlertTriangle, ArrowRight, ShieldCheck, Lock, Droplets, Target, RefreshCw, Zap, Award, CheckCircle2, ChevronRight } from 'lucide-react';
import { enhanceUserPhotoToMaxed } from '../utils/faceEnhancer';

export default function ScoreReport({ 
  analysis, 
  originalImage, 
  maxedResult, 
  onOpenPaywall, 
  onStartNewScan, 
  isPaid 
}) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [userMaxedPhoto, setUserMaxedPhoto] = useState(null);

  const { 
    score_global = 74, 
    potentiel_realiste = 94, 
    defauts = [], 
    delai_estime_max_global_jours = 90, 
    message_utilisateur 
  } = analysis || {};

  // Génération de la version Maxée sur la vraie photo de l'utilisateur
  useEffect(() => {
    if (originalImage) {
      enhanceUserPhotoToMaxed(originalImage).then((enhanced) => {
        if (enhanced) setUserMaxedPhoto(enhanced);
      });
    }
  }, [originalImage]);

  const beforeImg = originalImage || '/assets/african_man_before.jpg';
  const afterImg = userMaxedPhoto || maxedResult?.url || '/assets/african_man_after.jpg';

  const deltaScore = Math.max(8, potentiel_realiste - score_global);

  const handleSliderMove = (e) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPos(percentage);
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'definition_mâchoire':
        return { label: 'Mâchoire & Masséters', color: '#D4AF37' };
      case 'anti_retention_eau':
        return { label: 'Anti-Rétention d\'eau', color: '#38BDF8' };
      case 'routine_peau':
        return { label: 'Soin Peau & Éclat', color: '#10B981' };
      case 'symetrie_posture':
        return { label: 'Symétrie & Posture', color: '#8B5CF6' };
      case 'densite_barbe':
        return { label: 'Barbe & Grooming', color: '#F59E0B' };
      default:
        return { label: 'Hygiène & Présence', color: '#06B6D4' };
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      {/* EN-TÊTE PRINCIPALE */}
      <div style={{ textAlign: 'center', marginBottom: '22px' }}>
        <div className="badge-gold pulse-glow" style={{ marginBottom: '10px' }}>
          <Sparkles size={14} />
          <span>Diagnostic IA Biométrique • Bilan Personnalisé</span>
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>
          Ton Visage au <span className="text-gold-gradient">Glow Up Maximal</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '540px', margin: '0 auto' }}>
          Voici la projection exacte de ton visage après élimination de la rétention d'eau, musculation mandibulaire et routine éclat.
        </p>
      </div>

      {/* 1. SECTION SUPÉRIEURE : SLIDER AVANT / APRÈS SUR LA VRAIE PHOTO DE L'UTILISATEUR */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '28px', borderColor: 'var(--gold-400)', boxShadow: '0 0 40px rgba(212, 175, 55, 0.22)' }}>
        <div 
          className="split-slider-container"
          style={{ height: '390px', borderRadius: '14px', position: 'relative', overflow: 'hidden' }}
          onMouseMove={(e) => (e.buttons === 1 || isDragging) && handleSliderMove(e)}
          onTouchMove={handleSliderMove}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
        >
          {/* Photo Avant (Visage actuel - pleine taille) */}
          <img 
            src={beforeImg} 
            alt="Ton visage actuel"
            className="split-image"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Photo Après (Glow Up Maxé - même taille exacte découpée par clip-path) */}
          <img 
            src={afterImg} 
            alt="Ton visage au Glow Up Maxé"
            className="split-image"
            style={{ 
              position: 'absolute',
              inset: 0,
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
              zIndex: 2
            }}
          />

          {/* Ligne verticale de séparation dorée */}
          <div 
            style={{ 
              position: 'absolute', 
              top: 0, 
              bottom: 0, 
              left: `${sliderPos}%`, 
              width: '3px', 
              background: 'var(--gold-400)', 
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.95)',
              transform: 'translateX(-50%)',
              zIndex: 3,
              pointerEvents: 'none'
            }} 
          />

          {/* Curseur de contrôle central */}
          <div className="slider-handle" style={{ left: `${sliderPos}%`, zIndex: 4 }}>
            <div className="slider-button">
              <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>◀ ▶</span>
            </div>
          </div>

          {/* Badges de comparaison */}
          <div className="slider-tag tag-before">TON VISAGE ACTUEL ({score_global}/100)</div>
          <div className="slider-tag tag-after">GLOW UP MAXÉ ({potentiel_realiste}/100)</div>
        </div>

        <div style={{ padding: '10px 14px 2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--gold-200)' }}>
          <Sparkles size={14} />
          <span>Glisse le curseur pour explorer la transformation sur ton propre visage</span>
        </div>
      </div>

      {/* 2. SECTION CENTRALE : LA DISTANCE QUI TE SÉPARE DE TON GLOW UP MAXIMUM */}
      <div className="glass-card" style={{ padding: '26px 22px', marginBottom: '28px', background: 'linear-gradient(135deg, rgba(14, 18, 29, 0.95) 0%, rgba(20, 26, 42, 0.95) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={22} color="var(--gold-400)" />
              <span>Distance vers ton Potentiel Maximum</span>
            </h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Évaluation biométrique précise des marges de progression
            </span>
          </div>

          <div className="badge-emerald" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
            🚀 +{deltaScore} Points de Potentiel
          </div>
        </div>

        {/* COMPTEUR COMPARATIF VISUEL */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '14px', padding: '18px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
          {/* Score Actuel */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 800 }}>Score Actuel</span>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#FFF', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
              {score_global}
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#FCD34D' }}>État de départ</span>
          </div>

          {/* Flèche de progression centrale */}
          <div style={{ textAlign: 'center', padding: '0 8px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--emerald-500)', marginBottom: '4px' }}>
              +{deltaScore} PTS
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--emerald-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <ArrowRight size={20} color="var(--emerald-500)" />
            </div>
          </div>

          {/* Potentiel Maximum */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--gold-300)', display: 'block', textTransform: 'uppercase', fontWeight: 800 }}>Glow Up Maxé</span>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--gold-300)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
              {potentiel_realiste}
              <span style={{ fontSize: '1rem', color: 'var(--gold-500)' }}>/100</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--emerald-500)', fontWeight: 700 }}>Plafond naturel</span>
          </div>
        </div>

        {/* BARRE DE PROGRESSION VISUELLE */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <span>Niveau actuel ({score_global}%)</span>
            <span style={{ color: 'var(--gold-300)', fontWeight: 800 }}>Cible atteignable ({potentiel_realiste}%)</span>
          </div>

          <div style={{ height: '12px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', position: 'relative', overflow: 'hidden' }}>
            {/* Barre score actuel */}
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${score_global}%`, background: 'rgba(255, 255, 255, 0.4)', borderRadius: '999px', zIndex: 1 }} />
            {/* Barre potentiel max */}
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${potentiel_realiste}%`, background: 'var(--gold-gradient)', borderRadius: '999px', boxShadow: '0 0 15px rgba(212, 175, 55, 0.8)' }} />
          </div>
        </div>

        {/* DÉLAI ESTIMÉ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--gold-100)', background: 'rgba(212, 175, 55, 0.08)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-gold)' }}>
          <Clock size={16} color="var(--gold-400)" />
          <span>Délai estimé pour combler cette distance de <strong>+{deltaScore} pts</strong> : <strong>{delai_estime_max_global_jours} jours</strong> de routine naturelle.</span>
        </div>

        {/* SYNTHÈSE DIAGNOSTIC PERSONNALISÉ */}
        <div style={{ marginTop: '16px', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', fontStyle: 'italic', borderLeft: '3px solid var(--gold-400)', paddingLeft: '14px' }}>
          "{message_utilisateur || `Ton visage présente une excellente base structurelle. En ciblant la rétention d'eau sous-cutanée et en appliquant une posture linguale continue (mewing), ton contour facial va gagner une définition spectaculaire.`}"
        </div>
      </div>

      {/* 3. DÉCOMPOSITION DES 5 PILIERS BIOMÉTRIQUES & DISTANCE PAR DÉFAUT */}
      <h3 style={{ fontSize: '1.3rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Target size={20} color="var(--gold-400)" />
        <span>Distance & Gains Détaillés par Axe Biométrique :</span>
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        {defauts.map((d, index) => {
          const badge = getCategoryBadge(d.categorie_action);
          const currentAxeScore = d.score_actuel || 6;
          const targetAxeScore = d.score_potentiel_realiste_90j || 9;
          const axeDelta = targetAxeScore - currentAxeScore;

          return (
            <div key={d.id || index} className="glass-surface" style={{ padding: '16px 18px', borderLeft: `4px solid ${badge.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: badge.color, display: 'block', marginBottom: '2px' }}>
                    {badge.label}
                  </span>
                  <strong style={{ fontSize: '1rem', color: '#FFF' }}>{d.defaut}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{currentAxeScore}/10</span>
                    <span style={{ margin: '0 4px', color: 'var(--gold-400)' }}>➔</span>
                    <span style={{ color: 'var(--gold-300)' }}>{targetAxeScore}/10</span>
                  </div>
                  <span className="badge-gold" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                    +{axeDelta} pts
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '8px' }}>
                {d.cause_probable}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                <span>⏱ Résolution estimée : ~{d.delai_estime_jours || 30} jours</span>
                <span style={{ color: badge.color, fontWeight: 700 }}>Plan d'action inclus ✓</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. ACTIONS & BOUTONS DE CONVERSION */}
      <div className="glass-card" style={{ padding: '26px 20px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(14, 18, 29, 0.98) 100%)' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>
          Prêt à combler ces <span className="text-gold-gradient">+{deltaScore} points</span> ?
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px', maxWidth: '480px', margin: '0 auto 20px' }}>
          Active ton programme quotidien personnalisé jour par jour pour atteindre ton visage maxé en {delai_estime_max_global_jours} jours.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn-primary" 
            onClick={onOpenPaywall}
            style={{ padding: '14px 28px', fontSize: '1rem' }}
          >
            <Zap size={18} />
            <span>Débloquer mon programme d'action ({delai_estime_max_global_jours}J)</span>
            <ChevronRight size={18} />
          </button>

          <button 
            className="btn-secondary" 
            onClick={onStartNewScan}
            style={{ padding: '14px 20px', fontSize: '0.9rem' }}
          >
            <RefreshCw size={16} />
            <span>Refaire un scan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
