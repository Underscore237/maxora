import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, CircleDashed, ShieldCheck, Zap } from 'lucide-react';

export default function AnalysisLoading() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "Mesure biométrique des 468 repères faciaux et symétrie", delay: 1200 },
    { label: "Calcul de la définition mandibulaire et angle cervico-mentonnier", delay: 2400 },
    { label: "Détection de la rétention d'eau sous-cutanée et état de la peau", delay: 3600 },
    { label: "Établissement du plafond réaliste et formulation du programme sur-mesure", delay: 4800 }
  ];

  useEffect(() => {
    const timers = steps.map((s, index) => {
      return setTimeout(() => {
        setCurrentStep(index + 1);
      }, s.delay);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="analysis-screen">
      {/* Radar Scanner Futuriste */}
      <div className="radar-spinner">
        <div className="radar-pulse-ring" />
        <div className="radar-circle" />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={36} color="var(--gold-400)" />
        </div>
      </div>

      <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
        Analyse d'harmonie faciale par IA en cours...
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
        Notre modèle mesure chaque axe sans déformation ni standard artificiel.
      </p>

      {/* Liste des étapes dynamiques */}
      <div className="analysis-steps-list">
        {steps.map((step, idx) => {
          const isDone = currentStep > idx;
          const isActive = currentStep === idx;

          return (
            <div 
              key={idx} 
              className={`analysis-step-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
            >
              {isDone ? (
                <CheckCircle2 size={20} color="var(--emerald-500)" />
              ) : isActive ? (
                <div style={{ animation: 'spin 1s infinite linear' }}>
                  <CircleDashed size={20} color="var(--gold-400)" />
                </div>
              ) : (
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid var(--border-subtle)' }} />
              )}
              <span style={{ fontSize: '0.88rem' }}>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
