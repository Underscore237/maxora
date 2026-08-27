import React, { useState } from 'react';
import { X, CheckCircle, Sparkles, User, Mail, Shield } from 'lucide-react';
import { loginGoogle } from '../utils/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, currentUser }) {
  const [loading, setLoading] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const handleInstantGoogleLogin = async (presetName, presetEmail) => {
    setLoading(true);
    try {
      const email = presetEmail || customEmail || 'moussa.diallo@glowup.ai';
      const name = presetName || customName || 'Moussa Diallo';
      
      const res = await loginGoogle({
        email,
        name,
        avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${name}`
      });

      if (res.success) {
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err) {
      console.error('Erreur login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="glass-card paywall-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
              <Sparkles size={18} color="#000" />
            </div>
            <h3 style={{ fontSize: '1.2rem' }}>Connexion GLOW UP</h3>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {currentUser?.email ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--gold-gradient)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '1.8rem', fontWeight: 800 }}>
              {currentUser.name ? currentUser.name[0].toUpperCase() : 'G'}
            </div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{currentUser.name}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>{currentUser.email}</p>
            <div className="badge-gold" style={{ marginBottom: '24px' }}>
              Plan actif : {currentUser.plan === 'glow_up_90' ? 'VIP 90 Jours' : currentUser.plan === 'glow_up_30' ? 'Pro 30 Jours' : 'Découverte Gratuit'}
            </div>
            <button className="btn-secondary" onClick={onClose} style={{ width: '100%' }}>
              Continuer
            </button>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.5' }}>
              Connecte-toi en 1 clic pour sauvegarder tes scans, ton score d'harmonie et ton programme de progression.
            </p>

            {/* Bouton Officiel Google 1-Clic */}
            <button 
              className="btn-primary" 
              onClick={() => handleInstantGoogleLogin('Ibrahim Traoré', 'ibrahim.traore@gmail.com')}
              disabled={loading}
              style={{ width: '100%', marginBottom: '16px', display: 'flex', gap: '12px', background: '#FFF', color: '#000' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continuer avec Google</span>
            </button>

            <div style={{ textAlign: 'center', margin: '16px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              OU CONNEXION RAPIDE
            </div>

            {/* Quick profiles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <button 
                className="btn-secondary" 
                onClick={() => handleInstantGoogleLogin('Samuel E.', 'samuel.e@glowup.ai')}
                disabled={loading}
                style={{ fontSize: '0.85rem', padding: '10px' }}
              >
                👤 Profil Yaoundé
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => handleInstantGoogleLogin('Abdoulaye S.', 'abdoulaye.s@glowup.ai')}
                disabled={loading}
                style={{ fontSize: '0.85rem', padding: '10px' }}
              >
                👤 Profil Abidjan / Dakar
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.75rem', justifyContent: 'center' }}>
              <Shield size={14} color="var(--emerald-500)" />
              <span>Données chiffrées & respect absolu de la vie privée</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
