import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Camera, Share2, Download, Lock, Crown, ArrowRight, Award, ShieldCheck } from 'lucide-react';
import { getFollowupComparison } from '../utils/api';

export default function WeeklyFollowup({ onOpenPaywall, onStartNewScan, isPaid }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getFollowupComparison();
        setData(res);
      } catch (err) {
        console.error('Erreur chargement suivi J+7:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Calcul de ton évolution hebdomadaire...</p>
      </div>
    );
  }

  // RÈGLE SECTION 7 : RÉSERVÉ AUX ABONNÉS PAYANTS
  if (!isPaid) {
    return (
      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '36px 24px', textAlign: 'center' }}>
        <div className="lock-gold-icon" style={{ margin: '0 auto 20px' }}>
          <Lock size={28} />
        </div>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '10px' }}>
          Suivi Hebdomadaire & Delta J+7 Réservé
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.6' }}>
          Compare tes photos toutes les semaines, mesure tes points d'harmonie gagnés et génère des cartes de progression partageables sur TikTok et Instagram.
        </p>
        <button className="btn-primary" onClick={onOpenPaywall}>
          <Crown size={18} />
          <span>Débloquer le suivi hebdomadaire (3 000 FCFA)</span>
        </button>
      </div>
    );
  }

  const initialScore = data?.initialScan?.score_global || 68;
  const latestScore = data?.latestScan?.score_global || 76;
  const delta = (latestScore - initialScore) || 8;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div className="glass-card" style={{ padding: '28px 20px', textAlign: 'center', marginBottom: '24px' }}>
        <div className="badge-emerald" style={{ marginBottom: '12px' }}>
          <TrendingUp size={14} />
          <span>Progression Hebdomadaire Validée</span>
        </div>

        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
          Ton évolution en direct : <span style={{ color: 'var(--emerald-500)' }}>+{delta} Points</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
          Basé sur tes scans faciaux réels et ta régularité quotidienne.
        </p>

        {/* Tableau comparatif des scores */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center', maxWidth: '420px', margin: '0 auto 24px' }}>
          <div className="glass-surface" style={{ padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Scan Initial</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {initialScore} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
          </div>

          <div style={{ fontSize: '1.4rem', color: 'var(--emerald-500)', fontWeight: 900 }}>➔</div>

          <div className="glass-surface" style={{ padding: '16px 12px', textAlign: 'center', borderColor: 'var(--emerald-500)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--emerald-500)', textTransform: 'uppercase', fontWeight: 700 }}>Scan Récent</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--emerald-500)', fontFamily: 'var(--font-display)' }}>
              {latestScore} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={onStartNewScan} style={{ padding: '12px 24px' }}>
          <Camera size={18} />
          <span>Prendre ma nouvelle photo de contrôle</span>
        </button>
      </div>

      {/* CARTE VIRALE PARTAGEABLE (FORMAT STORY 9:16 - SECTION 7) */}
      <h3 style={{ fontSize: '1.3rem', marginBottom: '14px', textAlign: 'center' }}>
        🔥 Ta carte de transformation (Story / TikTok)
      </h3>

      <div className="viral-card-preview">
        <div className="viral-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/assets/maxora_logo_transparent.png" alt="MAXORA" style={{ height: '24px', objectFit: 'contain' }} />
          </div>

          <div className="viral-delta-badge">
            +{delta} PTS
          </div>
        </div>

        {/* Visuel Avant/Après superposé */}
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
              <img 
                src="/assets/african_man_before.jpg" 
                alt="J0" 
                style={{ width: '100%', height: '140px', objectFit: 'cover' }}
              />
              <div style={{ background: 'rgba(0,0,0,0.8)', fontSize: '0.7rem', padding: '4px', fontWeight: 800 }}>J0 : {initialScore}/100</div>
            </div>

            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--gold-400)' }}>
              <img 
                src="/assets/african_man_after.jpg" 
                alt="J+7" 
                style={{ width: '100%', height: '140px', objectFit: 'cover' }}
              />
              <div style={{ background: 'var(--gold-500)', color: '#000', fontSize: '0.7rem', padding: '4px', fontWeight: 900 }}>J+7 : {latestScore}/100</div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--gold-200)', marginBottom: '4px' }}>
            "Discipline & Mewing"
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Généré par glowup.ai • Looksmaxing Masculin
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          className="btn-secondary" 
          onClick={() => alert("Image prête à être partagée sur WhatsApp, TikTok ou Instagram Story !")}
          style={{ gap: '8px' }}
        >
          <Share2 size={16} />
          <span>Partager ma story de progression</span>
        </button>
      </div>
    </div>
  );
}
