import React, { useState } from 'react';
import { Sparkles, Lock, ArrowLeft, Crown, ShieldAlert, Share2, Download, Eye } from 'lucide-react';

export default function MaxedPreview({ 
  originalImage, 
  maxedResult, 
  isPaid, 
  onOpenPaywall, 
  onBack 
}) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPos(percentage);
  };

  const beforeImg = originalImage || '/assets/african_man_before.jpg';
  const afterImg = maxedResult?.url || '/assets/african_man_after.jpg';

  return (
    <div className="maxed-container" style={{ maxWidth: '640px', margin: '0 auto' }}>
      {/* En-tête */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button className="btn-secondary" onClick={onBack} style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} />
          <span>Retour au rapport</span>
        </button>

        <div className="badge-gold">
          <Sparkles size={14} />
          <span>Preview "Glow Up Maxé"</span>
        </div>
      </div>

      <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
        Visualise ton <span className="text-gold-gradient">potentiel maximal</span>
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
        Transformation naturelle basée sur la réduction de rétention d'eau, la posture mandibulaire (mewing) et l'éclat de peau.
      </p>

      {/* RÈGLE DE COÛT CRITIQUE (SECTION 3) : TEASING FLOUTÉ POUR GRATUIT vs SLIDER POUR PAYANT */}
      {!isPaid ? (
        <div className="blurry-teaser-wrapper">
          <img 
            src={afterImg} 
            alt="Preview Glow Up Maxé Teaser" 
            className="blurry-image"
          />

          <div className="teaser-lock-overlay">
            <div className="lock-gold-icon">
              <Lock size={28} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', color: '#FFF' }}>
              Preview HD Verrouillée
            </h3>
            <p style={{ color: 'var(--gold-100)', fontSize: '0.9rem', maxWidth: '380px', marginBottom: '24px', lineHeight: '1.5' }}>
              Ton potentiel maximal a été modélisé par l'IA. Débloque ta preview haute définition et ton plan d'action quotidien sur-mesure.
            </p>

            <button className="btn-primary" onClick={onOpenPaywall} style={{ padding: '14px 28px', fontSize: '1rem' }}>
              <Crown size={18} />
              <span>Débloquer ma transformation (3 000 FCFA)</span>
            </button>
          </div>
        </div>
      ) : (
        /* MODE PAYANT DÉBLOQUÉ : SLIDER FRACTIONNÉ AVANT / APRÈS INTERACTIF */
        <div className="demo-slider-wrapper">
          <div 
            className="split-slider-container"
            onMouseMove={(e) => (e.buttons === 1 || isDragging) && handleSliderMove(e)}
            onTouchMove={handleSliderMove}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
          >
            {/* Visage Actuel (Avant) */}
            <img 
              src={beforeImg} 
              alt="Scan initial" 
              className="split-image split-image-before"
            />

            {/* Visage Maxé (Après) */}
            <div 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: `${sliderPos}%`, 
                height: '100%', 
                overflow: 'hidden', 
                zIndex: 2,
                borderRight: '3px solid var(--gold-400)',
                boxShadow: '0 0 25px rgba(212, 175, 55, 0.7)'
              }}
            >
              <img 
                src={afterImg} 
                alt="Glow Up Maxé Débloqué" 
                className="split-image"
                style={{ width: '100%', minWidth: '100%', maxWidth: 'none' }}
              />
            </div>

            {/* Curseur de contrôle */}
            <div className="slider-handle" style={{ left: `${sliderPos}%` }}>
              <div className="slider-button">
                <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>◀ ▶</span>
              </div>
            </div>

            <div className="slider-tag tag-before">SCAN ACTUEL</div>
            <div className="slider-tag tag-after">POTENTIEL MAXÉ</div>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--gold-200)' }}>
            ✨ Glisse le curseur pour explorer la symétrie, la mâchoire sculptée et l'éclat de teint.
          </div>
        </div>
      )}

      {/* MENTION LÉGALE PRODUIT OBLIGATOIRE (SECTION 5.2 & 12) */}
      <div className="glass-surface" style={{ padding: '14px 18px', marginTop: '24px', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
        <ShieldAlert size={20} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>
            Positionnement Produit & Réalisme :
          </strong>
          Ce rendu illustre ton <em>potentiel maximal long terme</em> sans modifier ta structure osseuse ni ta carnation. Le programme d'action quotidien t'en rapproche chaque jour.
        </div>
      </div>
    </div>
  );
}
