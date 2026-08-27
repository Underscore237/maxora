import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingHero from './components/LandingHero';
import CameraScanner from './components/CameraScanner';
import AnalysisLoading from './components/AnalysisLoading';
import ScoreReport from './components/ScoreReport';
import MaxedPreview from './components/MaxedPreview';
import PaywallModal from './components/PaywallModal';
import AuthModal from './components/AuthModal';
import DailyDashboard from './components/DailyDashboard';
import WeeklyFollowup from './components/WeeklyFollowup';
import PerfumeRecipes from './components/PerfumeRecipes';
import { fetchUser, analyzePhoto, generateMaxedPreview } from './utils/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('landing');
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [maxedResult, setMaxedResult] = useState(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [scanError, setScanError] = useState(null);

  // Initialisation du profil utilisateur et de l'écouteur PWA
  useEffect(() => {
    document.title = "MAXORA — Diagnostic IA Biométrique & Potentiel Masculin";
    
    // Mettre à jour dynamiquement le favicon dans l'onglet
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    link.href = '/favicon.svg?v=' + Date.now();
    document.getElementsByTagName('head')[0].appendChild(link);

    async function init() {
      try {
        const data = await fetchUser();
        if (data?.user) {
          setUser(data.user);
          if (data.latestScan?.defauts) {
            setAnalysis({
              score_global: data.latestScan.score_global,
              defauts: data.latestScan.defauts,
              delai_estime_max_global_jours: data.latestScan.delai_estime_max_global_jours,
              message_utilisateur: data.latestScan.message_utilisateur,
              photo_valide: true
            });
            setCapturedImage(data.latestScan.fullImageStored || null);
          }
        }
      } catch (err) {
        console.error('Erreur chargement profil:', err);
      }
    }
    init();

    // Événement d'installation PWA native
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  // Lancement du scan
  const handleStartScan = () => {
    setScanError(null);
    setActiveTab('scanner');
  };

  // Traitement de la photo capturée
  const handlePhotoCaptured = async (imageBase64) => {
    setCapturedImage(imageBase64);
    setActiveTab('loading');
    setScanError(null);

    try {
      // 1. Analyse faciale par IA Gemini
      const analysisData = await analyzePhoto(imageBase64);

      if (!analysisData.photo_valide && analysisData.raison_si_invalide) {
        setScanError(analysisData.raison_si_invalide);
        setActiveTab('scanner');
        return;
      }

      setAnalysis(analysisData.analysis || analysisData);
      setActiveTab('report');

      // Rafraîchir les données utilisateur (plan, scans)
      const uData = await fetchUser();
      if (uData?.user) setUser(uData.user);

      // 2. Lancement en tâche de fond de la génération "Glow Up Maxé"
      generateMaxedPreview(imageBase64).then((maxRes) => {
        if (maxRes.success && maxRes.result) {
          setMaxedResult(maxRes.result);
        }
      }).catch(err => {
        console.warn('Génération maxé en arrière-plan:', err);
      });

    } catch (err) {
      console.error('Erreur analyse photo:', err);
      setScanError("Une erreur est survenue lors de l'analyse. Réessaie dans un endroit bien éclairé.");
      setActiveTab('scanner');
    }
  };

  const handlePlanActivated = (updatedUser) => {
    setUser(updatedUser);
    setActiveTab('dashboard');
  };

  const isPaid = user?.plan === 'glow_up_30' || user?.plan === 'glow_up_90';

  return (
    <div className="app-container">
      {/* Orbes d'ambiance animées en arrière-plan (Effet Waouh & Profondeur) */}
      <div className="ambient-glow-mesh">
        <div className="glow-orb glow-orb-gold" />
        <div className="glow-orb glow-orb-emerald" />
        <div className="glow-orb glow-orb-cyan" />
      </div>

      {/* Barre de navigation supérieure */}
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPaywall={() => setIsPaywallOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onStartScan={handleStartScan}
        deferredPrompt={deferredPrompt}
        onInstallPwa={handleInstallPwa}
      />

      {/* Message d'erreur / validation de photo si rejet */}
      {scanError && activeTab === 'scanner' && (
        <div style={{ maxWidth: '500px', margin: '16px auto 0', padding: '12px 18px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--rose-500)', borderRadius: 'var(--radius-md)', color: '#FECDD3', fontSize: '0.88rem', textAlign: 'center' }}>
          ⚠️ {scanError}
        </div>
      )}

      {/* Contenu principal selon l'onglet actif avec transition animée fluide */}
      <main className="main-content">
        <div key={activeTab} className="page-transition-wrapper animate-page-enter">
          {activeTab === 'landing' && (
            <LandingHero
              onStartScan={handleStartScan}
              onOpenPaywall={() => setIsPaywallOpen(true)}
            />
          )}

          {activeTab === 'scanner' && (
            <CameraScanner
              onPhotoCaptured={handlePhotoCaptured}
              onCancel={() => setActiveTab('landing')}
            />
          )}

          {activeTab === 'loading' && (
            <AnalysisLoading />
          )}

          {activeTab === 'report' && (
            <ScoreReport
              analysis={analysis}
              originalImage={capturedImage}
              maxedResult={maxedResult}
              isPaid={isPaid}
              onOpenPaywall={() => setIsPaywallOpen(true)}
              onStartNewScan={handleStartScan}
            />
          )}

          {activeTab === 'maxed' && (
            <MaxedPreview
              originalImage={capturedImage}
              maxedResult={maxedResult}
              isPaid={isPaid}
              onOpenPaywall={() => setIsPaywallOpen(true)}
              onBack={() => setActiveTab('report')}
            />
          )}

          {activeTab === 'dashboard' && (
            <DailyDashboard
              userPlan={user?.plan}
              onOpenPaywall={() => setIsPaywallOpen(true)}
              onStartFollowupScan={handleStartScan}
            />
          )}

          {activeTab === 'followup' && (
            <WeeklyFollowup
              isPaid={isPaid}
              onOpenPaywall={() => setIsPaywallOpen(true)}
              onStartNewScan={handleStartScan}
            />
          )}

          {activeTab === 'perfume' && (
            <PerfumeRecipes />
          )}
        </div>
      </main>

      {/* Modals globales */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onPlanActivated={handlePlanActivated}
        currentPlan={user?.plan}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => setUser(u)}
        currentUser={user}
      />
    </div>
  );
}
