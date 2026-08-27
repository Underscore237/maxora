import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Flame, CheckCircle, Zap, Droplets, Target, Award, Star, Activity, UserCheck } from 'lucide-react';

export default function LandingHero({ onStartScan, onOpenPaywall }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  // Formules rotatives pour le titre principal avec double grille de lecture
  const rotatingFormulas = [
    { prefix: "Révèle ton", highlight: "potentiel maximal", suffix: "sans artifice." },
    { prefix: "Sculpte ta", highlight: "mâchoire de guerrier", suffix: "sans chirurgie." },
    { prefix: "Débloque ton", highlight: "charisme magnétique", suffix: "dès aujourd'hui." },
    { prefix: "Atteins ton", highlight: "aura de haut statut", suffix: "en 30 jours." }
  ];

  const [formulaIndex, setFormulaIndex] = useState(0);
  const [displayText, setDisplayText] = useState(rotatingFormulas[0].highlight);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(rotatingFormulas[0].highlight.length);

  const liveTickers = [
    "🔥 Koffi (Abidjan, CI) vient de gagner +8.5 pts au scan J+14 !",
    "💎 Samuel (Yaoundé, CM) a débloqué son Programme 90J Élite",
    "⚡ Amadou (Dakar, SN) a atteint 12 jours consécutifs de Mewing 🔥",
    "✨ Junior (Cotonou, BJ) : Texture de peau notée à 9.1/10"
  ];

  // Rotation du ticker en direct
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % liveTickers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Effet Typewriter dynamique sur le mot en or
  useEffect(() => {
    const targetWord = rotatingFormulas[formulaIndex].highlight;
    let typingSpeed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < targetWord.length) {
        setDisplayText(targetWord.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (!isDeleting && charIndex === targetWord.length) {
        // Pause à la fin de la frappe
        setTimeout(() => setIsDeleting(true), 2400);
      } else if (isDeleting && charIndex > 0) {
        setDisplayText(targetWord.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setFormulaIndex((prev) => (prev + 1) % rotatingFormulas.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, formulaIndex]);

  // Animation oscillante du slider
  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      if (!isDragging) {
        step += 0.03;
        const newPos = 50 + Math.sin(step) * 12;
        setSliderPos(newPos);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [isDragging]);

  const handleSliderMove = (e) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPos(percentage);
  };

  const currentFormula = rotatingFormulas[formulaIndex];

  return (
    <div className="landing-hero">
      {/* 1. RUBAN D'ACTIVITÉ COMMUNAUTAIRE EN DIRECT */}
      <div className="hero-top-status-strip">
        <div className="status-live-beacon">
          <span className="beacon-ping" />
          <span className="beacon-dot" />
        </div>
        <span className="status-live-text">{liveTickers[tickerIndex]}</span>
      </div>

      {/* 2. BADGE DE CERTIFICATION BIOMÉTRIQUE MAXORA */}
      <div className="hero-badge-container">
        <div className="hero-biometric-shield">
          <div className="shield-sparkle-icon">
            <Sparkles size={13} color="#D4AF37" />
          </div>
          <span className="shield-text">DIAGNOSTIC IA BIOMÉTRIQUE • HARMONIE & STRUCTURE</span>
          <div className="shield-status-tag">MAXORA AI</div>
        </div>
      </div>

      {/* TITRE PRINCIPAL AVEC DOUBLE GRILLE DE LECTURE ANIMÉE */}
      <h1 className="hero-title" style={{ minHeight: '3.4em', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span>
          {currentFormula.prefix}{' '}
          <span className="text-gold-gradient">
            {displayText}
          </span>
          <span className="typewriter-cursor" />
        </span>
        <span style={{ display: 'block', fontSize: '0.88em', fontWeight: 800 }}>
          {currentFormula.suffix}
        </span>
      </h1>

      {/* SOUS-TITRE PRÉCIS & ADAPTÉ */}
      <p className="hero-subtitle">
        Scanne ton visage en 10 secondes. Obtiens ton <strong>score d'harmonie faciale</strong> par IA, 
        visualise ta transformation réaliste et suis un <strong>programme quotidien sur-mesure</strong> 
        (Mewing, Savon noir & Karité brut, Décongestion lymphatique, Recettes de parfum local).
      </p>

      {/* CTA PRINCIPAUX AVEC EFFET RIPPLE */}
      <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
        <button className="btn-primary ripple-btn" onClick={onStartScan} style={{ fontSize: '1.05rem', padding: '15px 32px' }}>
          <Sparkles size={19} />
          <span>Commencer mon diagnostic gratuit</span>
          <ArrowRight size={19} />
        </button>

        <button className="btn-secondary ripple-btn" onClick={onOpenPaywall} style={{ fontSize: '0.95rem', padding: '15px 24px' }}>
          <span>Voir les offres & tarifs</span>
        </button>
      </div>

      {/* DÉMO SLIDER AVANT / APRÈS (COMPACT, MOTIVANT ET 100% AFRICAIN) */}
      <div className="demo-slider-wrapper-outer">
        <div className="floating-stat-card stat-card-left">
          <Droplets size={16} />
          <span>💧 Rétention : -85%</span>
        </div>

        <div className="floating-stat-card stat-card-right">
          <Zap size={16} />
          <span>⚡ Mâchoire : +3.4x sculptée</span>
        </div>

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
            {/* Image "Avant" */}
            <img 
              src="/assets/african_man_before.jpg" 
              alt="Visage avant Glow Up"
              className="split-image"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Image "Après" avec clip-path pixel-perfect */}
            <img 
              src="/assets/african_man_after.jpg" 
              alt="Visage après Glow Up Maxé"
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

            {/* Points de repères biométriques HUD */}
            <div className="hud-dot" style={{ top: '38%', left: '36%' }} />
            <div className="hud-dot" style={{ top: '38%', right: '36%', animationDelay: '-0.5s' }} />
            <div className="hud-dot" style={{ top: '48%', left: '50%', transform: 'translateX(-50%)', animationDelay: '-1s' }} />
            <div className="hud-dot" style={{ top: '68%', left: '26%', animationDelay: '-1.5s' }} />
            <div className="hud-dot" style={{ top: '68%', right: '26%', animationDelay: '-1.2s' }} />

            {/* Barre & Poignée de contrôle */}
            <div className="slider-handle" style={{ left: `${sliderPos}%` }}>
              <div className="slider-button">
                <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>◀ ▶</span>
              </div>
            </div>

            {/* Badges */}
            <div className="slider-tag tag-before">ACTUEL (68/100)</div>
            <div className="slider-tag tag-after">MAXÉ (89/100)</div>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--gold-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Sparkles size={13} />
            <span>Glisse le curseur pour explorer la transformation naturelle</span>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', maxWidth: '820px', margin: '0 auto 48px' }}>
        <div className="glass-surface" style={{ padding: '16px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--gold-300)', fontFamily: 'var(--font-display)' }}>+14 800</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Diagnostics analysés</div>
        </div>
        <div className="glass-surface" style={{ padding: '16px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--emerald-500)', fontFamily: 'var(--font-display)' }}>+8.7 pts</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Gain moyen à J+30</div>
        </div>
        <div className="glass-surface" style={{ padding: '16px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#FFF', fontFamily: 'var(--font-display)' }}>100%</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Méthodes naturelles</div>
        </div>
        <div className="glass-surface" style={{ padding: '16px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--gold-400)', fontFamily: 'var(--font-display)' }}>4.9 ★</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Score communauté</div>
        </div>
      </div>

      {/* LES 4 PILIERS DE LA TRANSFORMATION GLOW UP */}
      <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
        Un système complet en <span className="text-gold-gradient">4 piliers d'action</span>
      </h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 24px', fontSize: '0.9rem' }}>
        Pas de chirurgie ni de faux filtres. Des habitudes précises et mesurables, calibrées pour les hommes d'Afrique francophone.
      </p>

      <div className="features-grid">
        <div className="glass-card feature-card">
          <div className="feature-icon-wrapper">
            <Target size={22} />
          </div>
          <h3 style={{ fontSize: '1.1rem' }}>1. Sculpture Mâchoire & Mewing</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
            Posture linguale continue, chin tucks et mastication alternée pour muscler les masséters et retendre la ligne sous-maxillaire.
          </p>
        </div>

        <div className="glass-card feature-card">
          <div className="feature-icon-wrapper" style={{ color: 'var(--cyan-400)', background: 'rgba(6, 182, 212, 0.12)', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
            <Droplets size={22} />
          </div>
          <h3 style={{ fontSize: '1.1rem' }}>2. Anti-Rétention d'Eau</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
            Drainage lymphatique matinal, régulation du sodium (bouillons cubes) et protocole 2.5L pour dégonfler les joues en 48h.
          </p>
        </div>

        <div className="glass-card feature-card">
          <div className="feature-icon-wrapper" style={{ color: 'var(--emerald-500)', background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <Sparkles size={22} />
          </div>
          <h3 style={{ fontSize: '1.1rem' }}>3. Peau Nette & Ingrédients Locaux</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
            Savon noir africain, hydratation au Karité brut, crème SPF 30+ anti-taches et huile de ricin pour une barbe dense et tracée.
          </p>
        </div>

        <div className="glass-card feature-card">
          <div className="feature-icon-wrapper" style={{ color: 'var(--flame-500)', background: 'rgba(249, 115, 22, 0.12)', borderColor: 'rgba(249, 115, 22, 0.3)' }}>
            <Flame size={22} />
          </div>
          <h3 style={{ fontSize: '1.1rem' }}>4. Parfums & Sillage Signature</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
            Recettes exclusives de compositions locales (Agrumes/Santal pour la journée, Poivre de Penja & Oud pour les soirées/dates).
          </p>
        </div>
      </div>

      {/* TÉMOIGNAGES CLIENTS */}
      <div style={{ margin: '40px 0' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>👑 Retours de la communauté</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          <div className="glass-card" style={{ padding: '18px', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <img src="/assets/african_avatar_1.jpg" alt="Avatar" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold-400)' }} />
              <div>
                <strong style={{ fontSize: '0.95rem', display: 'block' }}>Kouamé D.</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Abidjan, Côte d'Ivoire • +11 pts</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.5' }}>
              "Le drainage lymphatique + le mewing m'ont affiné les joues en seulement 3 semaines. Les compliments au bureau ont commencé dès la semaine 2 !"
            </p>
          </div>

          <div className="glass-card" style={{ padding: '18px', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--gold-gradient)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>MB</div>
              <div>
                <strong style={{ fontSize: '0.95rem', display: 'block' }}>Mamadou B.</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dakar, Sénégal • +9.2 pts</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.5' }}>
              "Enfin une application qui comprend la peau noire et nos climats avec le savon noir et le karité. Le score J+14 m'a bluffé."
            </p>
          </div>
        </div>
      </div>

      {/* BANNIÈRE CTA DE FIN */}
      <div className="glass-card" style={{ padding: '32px 20px', textAlign: 'center', marginTop: '30px', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.14) 0%, rgba(9, 12, 19, 0.98) 100%)' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Prêt à révéler ton vrai potentiel ?</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
          Diagnostic facial gratuit sans engagement. 1 photo suffit.
        </p>
        <button className="btn-primary ripple-btn" onClick={onStartScan} style={{ fontSize: '1rem', padding: '14px 30px' }}>
          <Sparkles size={18} />
          <span>Faire mon scan gratuit</span>
        </button>
      </div>
    </div>
  );
}
