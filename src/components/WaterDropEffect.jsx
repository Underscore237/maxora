import React, { useState } from 'react';

/**
 * Hook pour déclencher des ondulations d'eau douces et relaxantes au clic
 */
export function useWaterRipple() {
  const [ripples, setRipples] = useState([]);

  const triggerRipple = (e, color = 'gold') => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || (rect.left + rect.width / 2);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || (rect.top + rect.height / 2);

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const id = `ripple_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newRipple = { id, x, y, color };

    setRipples((prev) => [...prev.slice(-2), newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1800); // Durée douce et relaxante
  };

  return { ripples, triggerRipple };
}

/**
 * Composant d'ondulations d'eau douces et relaxantes (Water Ripples)
 * Strictement contenu dans le bloc cliqué
 */
export default function WaterRippleOverlay({ ripples }) {
  if (!ripples || ripples.length === 0) return null;

  return (
    <div className="water-ripple-container">
      {ripples.map((r) => (
        <div key={r.id} style={{ position: 'absolute', left: r.x, top: r.y, pointerEvents: 'none' }}>
          {/* Ondulation 1 principale */}
          <div className={`calm-water-ring ring-1 ${r.color === 'gold' ? 'ring-gold' : 'ring-cyan'}`} />
          {/* Ondulation 2 secondaire décalée */}
          <div className={`calm-water-ring ring-2 ${r.color === 'gold' ? 'ring-gold' : 'ring-cyan'}`} />
          {/* Ondulation 3 tertiaire douce */}
          <div className={`calm-water-ring ring-3 ${r.color === 'gold' ? 'ring-gold' : 'ring-cyan'}`} />
        </div>
      ))}
    </div>
  );
}
