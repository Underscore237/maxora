import React from 'react';
import { Flame, Sparkles, Crown, User, Download, Calendar, Activity, Droplets, Home, Camera } from 'lucide-react';

export default function Header({ 
  user, 
  onOpenPaywall, 
  onOpenAuth, 
  activeTab, 
  setActiveTab, 
  onStartScan,
  deferredPrompt,
  onInstallPwa
}) {
  const isPaid = user?.plan === 'glow_up_30' || user?.plan === 'glow_up_90';

  return (
    <>
      {/* HEADER SUPÉRIEUR RESPONSIVE */}
      <header className="app-header">
        <div className="header-inner">
          {/* LOGO OFFICIEL MAXORA */}
          <div 
            className="brand-logo" 
            onClick={() => setActiveTab('landing')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px 0' }}
          >
            <img 
              src="/assets/maxora_logo_centered.png" 
              alt="MAXORA Logo" 
              className="maxora-header-img"
            />
          </div>

          {/* NAVIGATION DESKTOP & TABLETTE (Masquée sur Mobile) */}
          <nav className="header-nav-desktop">
            <button 
              className={`btn-secondary ${activeTab === 'landing' ? 'active' : ''}`}
              onClick={() => setActiveTab('landing')}
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              Accueil
            </button>

            {user?.latestScanId && (
              <>
                <button 
                  className={`btn-secondary ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                  style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'center' }}
                >
                  <Calendar size={15} />
                  <span>Programme</span>
                </button>

                <button 
                  className={`btn-secondary ${activeTab === 'report' ? 'active' : ''}`}
                  onClick={() => setActiveTab('report')}
                  style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'center' }}
                >
                  <Activity size={15} />
                  <span>Mon Score</span>
                </button>
              </>
            )}

            <button 
              className={`btn-secondary ${activeTab === 'perfume' ? 'active' : ''}`}
              onClick={() => setActiveTab('perfume')}
              style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'center' }}
            >
              <Droplets size={15} color="var(--gold-400)" />
              <span>Parfums</span>
            </button>
          </nav>

          {/* ACTIONS RAPIDES (Streak, VIP, Profil) */}
          <div className="header-actions">
            {/* Streak Flamme */}
            {user && (
              <div className="streak-pill" title="Jours consécutifs">
                <Flame size={14} color="#F97316" fill="#F97316" />
                <span>{user.streakDays || 0}j</span>
              </div>
            )}

            {/* Bouton PWA Install si disponible */}
            {deferredPrompt && (
              <button 
                className="btn-secondary pwa-install-btn" 
                onClick={onInstallPwa}
                title="Installer l'application"
              >
                <Download size={14} />
                <span className="pwa-btn-text">Installer</span>
              </button>
            )}

            {/* Pass Élite / VIP */}
            {!isPaid ? (
              <button 
                className="btn-primary pass-elite-btn" 
                onClick={onOpenPaywall}
                title="Débloquer le Pass Élite"
              >
                <Crown size={13} />
                <span className="pass-btn-text">Pass VIP</span>
              </button>
            ) : (
              <div className="badge-gold vip-badge-pill">
                <Crown size={12} />
                <span>VIP</span>
              </div>
            )}

            {/* Profil Utilisateur */}
            <button 
              className="btn-secondary profile-btn" 
              onClick={onOpenAuth}
              title="Mon Profil"
              aria-label="Mon Profil"
            >
              <User size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* BARRE DE NAVIGATION MOBILE INFÉRIEURE FLUIDE (BOTTOM APP BAR) */}
      <nav className="mobile-bottom-nav">
        <button 
          className={`bottom-nav-item ${activeTab === 'landing' ? 'active' : ''}`}
          onClick={() => setActiveTab('landing')}
        >
          <Home size={18} />
          <span>Accueil</span>
        </button>

        {user?.latestScanId ? (
          <button 
            className={`bottom-nav-item ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            <Activity size={18} />
            <span>Mon Score</span>
          </button>
        ) : (
          <button 
            className={`bottom-nav-item ${activeTab === 'scanner' ? 'active' : ''}`}
            onClick={onStartScan}
          >
            <Camera size={18} />
            <span>Scan IA</span>
          </button>
        )}

        {user?.latestScanId && (
          <button 
            className={`bottom-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Calendar size={18} />
            <span>Programme</span>
          </button>
        )}

        <button 
          className={`bottom-nav-item ${activeTab === 'perfume' ? 'active' : ''}`}
          onClick={() => setActiveTab('perfume')}
        >
          <Droplets size={18} />
          <span>Parfums</span>
        </button>
      </nav>
    </>
  );
}
