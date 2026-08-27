import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Shield, Award, CheckCircle2, ChevronRight, Zap, Target, Lock, Crown, Layers } from 'lucide-react';
import { enhanceUserPhotoToMaxed } from '../utils/faceEnhancer';

export default function ScoreReport({ analysis, maxedResult, onUnlockProgram, originalImage }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [userMaxedPhoto, setUserMaxedPhoto] = useState(null);
  const [viewMode, setViewMode] = useState('flux'); // 'flux' (IA Studio 8K) ou 'morph' (Morphing réel)

  const { 
    score_global = 68, 
    potentiel_realiste = 91, 
    defauts = [], 
    delai_estime_max_global_jours = 90, 
    message_utilisateur 
  } = analysis || {};

  // Génération de la version Morphing sur la vraie photo de l'utilisateur
  useEffect(() => {
    if (originalImage) {
      enhanceUserPhotoToMaxed(originalImage).then((enhanced) => {
        if (enhanced) setUserMaxedPhoto(enhanced);
      });
    }
  }, [originalImage]);

  // URL IA FLUX Realism 8K directe et garantie
  const defaultFluxUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent("cinematic ultra-realistic 8k raw photographic portrait of a handsome African man after natural looksmaxing glow up, perfectly defined sculpted jawline, clear radiant luminous smooth skin tone, sharp groomed beard contours, intense magnetic masculine gaze, high cheekbones, luxury studio lighting, photorealistic 8k Hasselblad shot, symmetrical masculine aesthetics")}?model=flux-realism&width=1024&height=1024&nologo=true&enhance=true`;
  const fluxImg = maxedResult?.url || defaultFluxUrl;

  const beforeImg = originalImage || '/assets/african_man_before.jpg';
  const afterImg = viewMode === 'flux' 
    ? fluxImg 
    : (userMaxedPhoto || '/assets/african_man_after.jpg');

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
        return { label: 'Structure Faciale', color: '#06B6D4' };
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', paddingBottom: '30px' }}>
      {/* EN-TÊTE PRINCIPALE */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div className="badge-gold pulse-glow" style={{ marginBottom: '8px', fontSize: '0.76rem' }}>
          <Sparkles size={13} />
          <span>Diagnostic IA Biométrique • Bilan Personnalisé</span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '6px' }}>
          Ton Visage au <span className="text-gold-gradient">Glow Up Maximal</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '520px', margin: '0 auto' }}>
          Voici la projection exacte de ton potentiel après décongestion faciale, musculation mandibulaire et routine éclat.
        </p>
      </div>

      {/* SÉLECTEUR DE MODE DE VISUALISATION IA */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <button 
          className="btn-secondary"
          onClick={() => setViewMode('flux')}
          style={{
            padding: '7px 14px',
            fontSize: '0.78rem',
            borderRadius: '999px',
            border: viewMode === 'flux' ? '1px solid var(--gold-400)' : '1px solid rgba(255,255,255,0.1)',
            background: viewMode === 'flux' ? 'rgba(212, 175, 55, 0.18)' : 'transparent',
            color: viewMode === 'flux' ? '#FFF' : 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          ✨ <strong>Projection IA Studio 8K</strong>
        </button>

        <button 
          className="btn-secondary"
          onClick={() => setViewMode('morph')}
          style={{
            padding: '7px 14px',
            fontSize: '0.78rem',
            borderRadius: '999px',
            border: viewMode === 'morph' ? '1px solid var(--gold-400)' : '1px solid rgba(255,255,255,0.1)',
            background: viewMode === 'morph' ? 'rgba(212, 175, 55, 0.18)' : 'transparent',
            color: viewMode === 'morph' ? '#FFF' : 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          🧬 <strong>Morphing sur Ta Photo</strong>
        </button>
      </div>

      {/* 1. SLIDER AVANT / APRÈS PIXEL-PERFECT */}
      <div className="glass-card" style={{ padding: '14px', marginBottom: '24px', borderColor: 'var(--gold-400)', boxShadow: '0 0 35px rgba(212, 175, 55, 0.2)' }}>
        <div 
          className="split-slider-container"
          style={{ height: '380px', borderRadius: '14px', position: 'relative', overflow: 'hidden' }}
          onMouseMove={(e) => (e.buttons === 1 || isDragging) && handleSliderMove(e)}
          onTouchMove={handleSliderMove}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
        >
          {/* Photo Avant (Visage actuel) */}
          <img 
            src={beforeImg} 
            alt="Ton visage actuel"
            className="split-image"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Photo Après (Glow Up Maxé découpé par clip-path) */}
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

          {/* Ligne de séparation dorée */}
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

          {/* Badges Avant / Après */}
          <div className="split-badge-before" style={{ zIndex: 5 }}>
            AVANT ({score_global}/100)
          </div>
          <div className="split-badge-after" style={{ zIndex: 5 }}>
            MAXÉ ({potentiel_realiste}/100)
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          👆 Glisse le curseur pour comparer ton visage actuel et ton potentiel maximal
        </div>
      </div>

      {/* 2. STATISTIQUES DU SCORE BIOMÉTRIQUE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '22px' }}>
        <div className="glass-surface" style={{ padding: '16px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>SCORE ACTUEL</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)' }}>{score_global}</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>sur 100</div>
        </div>

        <div className="glass-surface" style={{ padding: '16px 10px', textAlign: 'center', borderColor: 'var(--gold-400)', background: 'rgba(212, 175, 55, 0.08)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--gold-400)', fontWeight: 800, marginBottom: '4px' }}>POTENTIEL MAX</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--gold-300)' }}>{potentiel_realiste}</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--gold-400)' }}>Atteignable</div>
        </div>

        <div className="glass-surface" style={{ padding: '16px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>PROGRESSION</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10B981' }}>+{deltaScore} pts</div>
          <div style={{ fontSize: '0.68rem', color: '#10B981' }}>En {delai_estime_max_global_jours} jours</div>
        </div>
      </div>

      {/* 3. DÉTAIL DES 5 PILIERS BIOMÉTRIQUES */}
      <div className="glass-card" style={{ padding: '20px 16px', marginBottom: '22px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} color="var(--gold-400)" />
          <span>Diagnostic par Piliers Biométriques :</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {defauts.map((d, index) => {
            const badge = getCategoryBadge(d.categorie);
            return (
              <div key={index} className="glass-surface" style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: badge.color }} />
                    <strong style={{ fontSize: '0.88rem' }}>{d.nom}</strong>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: badge.color, fontWeight: 700, background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px' }}>
                    Objectif {d.delai_jours}j
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                  {d.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. CTA DÉVERROUILLAGE DU PROGRAMME */}
      <div style={{ textAlign: 'center' }}>
        <button 
          className="btn-primary" 
          onClick={onUnlockProgram}
          style={{ width: '100%', padding: '15px 24px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Crown size={20} color="#000" />
          <span>Débloquer mon Programme d'Action Quotidien</span>
          <ArrowRight size={18} color="#000" />
        </button>
      </div>
    </div>
  );
}
