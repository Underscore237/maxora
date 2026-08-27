import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Upload, Sparkles, AlertCircle, ArrowLeft, Check, X, ShieldAlert } from 'lucide-react';

export default function CameraScanner({ onPhotoCaptured, onCancel }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' ou 'environment'
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isAligned, setIsAligned] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    "Cadre bien ton visage au centre de l'ovale",
    "Retire ta casquette ou bonnet pour dégager le front",
    "Retire tes lunettes de soleil",
    "Mets-toi face à la lumière naturelle (pas de contre-jour)"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Démarrage de la caméra
  const startCamera = async (mode = facingMode) => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1080 },
          height: { ideal: 1440 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Accès caméra impossible, bascule mode upload:', err);
      setCameraError("La caméra n'est pas accessible. Utilise le bouton d'importation de photo.");
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  // Basculer caméra avant/arrière
  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  // Capturer la photo depuis le flux vidéo
  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 960;

    const ctx = canvas.getContext('2d');
    // Si caméra avant, effet miroir horizontal pour naturel
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(base64);
  };

  // Import de photo depuis le stockage local
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Validation et envoi vers l'analyse
  const confirmPhoto = () => {
    if (capturedImage) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      onPhotoCaptured(capturedImage);
    }
  };

  // Réinitialiser la capture
  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div className="camera-container">
      {/* En-tête du scanner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button className="btn-secondary" onClick={onCancel} style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} />
          <span>Retour</span>
        </button>
        <div className="badge-gold">
          <Sparkles size={14} />
          <span>Scanner Facial IA</span>
        </div>
      </div>

      {/* Cadre de visée */}
      <div className="scanner-viewfinder">
        {capturedImage ? (
          // Affichage de la photo capturée
          <img 
            src={capturedImage} 
            alt="Capture pour analyse" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : isCameraActive ? (
          // Flux vidéo direct
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="camera-video"
              style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
            />
            {/* Ovale de cadrage facial */}
            <div className={`camera-oval-overlay ${isAligned ? 'aligned' : ''}`}>
              <div className="scanner-laser" />
            </div>
            {/* Conseil dynamique */}
            <div className="scanner-guidelines">
              💡 {tips[tipIndex]}
            </div>
          </>
        ) : (
          // Mode fallback si caméra désactivée / non disponible
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
            <AlertCircle size={48} color="var(--gold-400)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Caméra non active</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              {cameraError || "Autorise l'accès à ta caméra ou sélectionne une photo de face nette."}
            </p>
            <label className="btn-primary" style={{ cursor: 'pointer' }}>
              <Upload size={18} />
              <span>Choisir une photo de mon visage</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>
        )}
      </div>

      {/* Règles de validation avant analyse (Section 6) */}
      <div className="glass-surface" style={{ padding: '12px 16px', margin: '16px 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
        <div style={{ fontWeight: 700, color: 'var(--gold-300)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldAlert size={14} />
          <span>Conditions pour un score d'harmonie précis :</span>
        </div>
        <div>✓ Visage de face, centré et dégagé</div>
        <div>✓ Sans casquette, bonnet ni lunettes de soleil</div>
        <div>✓ Éclairage frontal uniforme</div>
      </div>

      {/* Contrôles du scanner */}
      {capturedImage ? (
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn-secondary" onClick={retakePhoto} style={{ flex: 1 }}>
            <X size={18} />
            <span>Reprendre</span>
          </button>
          <button className="btn-primary" onClick={confirmPhoto} style={{ flex: 1.5 }}>
            <Check size={18} />
            <span>Lancer l'analyse IA</span>
          </button>
        </div>
      ) : (
        <div className="camera-controls">
          {/* Bouton importer photo */}
          <label className="btn-secondary" style={{ padding: '12px 18px', cursor: 'pointer' }} title="Importer une photo">
            <Upload size={20} />
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          {/* Déclencheur Shutter principal */}
          {isCameraActive && (
            <button className="shutter-btn" onClick={capturePhoto} title="Prendre la photo">
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={26} color="#000" />
              </div>
            </button>
          )}

          {/* Basculer caméra */}
          {isCameraActive && (
            <button className="btn-secondary" onClick={toggleFacingMode} style={{ padding: '12px 18px' }} title="Changer de caméra">
              <RefreshCw size={20} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
