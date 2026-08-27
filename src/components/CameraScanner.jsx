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

  // Démarrage robuste et instantané de la caméra
  const startCamera = async (mode = facingMode) => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: mode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (errConstraint) {
        // Fallback sans contrainte de résolution
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode },
          audio: false
        });
      }

      setStream(mediaStream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(e => console.log('Autoplay play caught:', e));
        };
      }
    } catch (err) {
      console.warn('Accès caméra impossible, bascule mode upload:', err);
      setCameraError("Autorise l'accès à ta caméra ou importe une photo depuis ta galerie.");
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    startCamera(facingMode);
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
    // Si caméra avant, effet miroir horizontal pour rendu naturel
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(base64);
  };

  // Importer un fichier depuis la galerie
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedImage(event.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    if (!isCameraActive) {
      startCamera(facingMode);
    }
  };

  const confirmPhoto = () => {
    if (capturedImage && onPhotoCaptured) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      onPhotoCaptured(capturedImage);
    }
  };

  return (
    <div className="camera-container" style={{ maxWidth: '480px', margin: '0 auto' }}>
      {/* Barre d'actions supérieure */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <button className="btn-secondary" onClick={onCancel} style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} />
          <span>Retour</span>
        </button>

        <div className="badge-gold">
          <Sparkles size={14} />
          <span>Scan IA Biométrique</span>
        </div>

        <button 
          className="btn-secondary" 
          onClick={toggleFacingMode} 
          style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          title="Changer de caméra (Avant / Arrière)"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Zone de prévisualisation de la caméra */}
      <div className="camera-frame-wrapper">
        {/* La balise vidéo est TOUJOURS dans le DOM pour garantir la liaison du flux dès le 1er chargement */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          webkit-playsinline="true"
          className="camera-video"
          style={{ 
            display: (isCameraActive && !capturedImage) ? 'block' : 'none',
            transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' 
          }}
        />

        {capturedImage ? (
          // Photo capturée / importée
          <img 
            src={capturedImage} 
            alt="Capture pour analyse" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : isCameraActive ? (
          // Ovale de guidage et overlay laser
          <>
            <div className={`camera-oval-overlay ${isAligned ? 'aligned' : ''}`}>
              <div className="scanner-laser" />
            </div>
            <div className="scanner-guidelines">
              💡 {tips[tipIndex]}
            </div>
          </>
        ) : (
          // Fallback si la caméra est refusée
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
            <AlertCircle size={48} color="var(--gold-400)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Caméra en attente</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              {cameraError || "Autorise l'accès à ta caméra ou sélectionne une photo nette de face."}
            </p>
            <label className="btn-primary" style={{ cursor: 'pointer' }}>
              <Upload size={18} />
              <span>Choisir une photo de ma galerie</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>
        )}
      </div>

      {/* Règles de cadrage biométrique */}
      <div className="glass-surface" style={{ padding: '12px 16px', margin: '16px 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
        <div style={{ fontWeight: 700, color: 'var(--gold-300)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldAlert size={14} />
          <span>Conditions pour un diagnostic IA précis :</span>
        </div>
        <div>✓ Visage de face, centré et bien éclairé</div>
        <div>✓ Sans casquette, bonnet ni lunettes de soleil</div>
        <div>✓ Expression neutre (bouche fermée)</div>
      </div>

      {/* Contrôles de capture */}
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
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
          <label className="btn-secondary" style={{ padding: '14px', borderRadius: '50%', cursor: 'pointer' }} title="Importer une photo">
            <Upload size={20} />
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          <button 
            className="btn-primary" 
            onClick={capturePhoto}
            style={{ 
              width: '68px', 
              height: '68px', 
              borderRadius: '50%', 
              padding: 0,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(212, 175, 55, 0.6)'
            }}
            title="Prendre la photo"
          >
            <Camera size={30} color="#000" />
          </button>
        </div>
      )}
    </div>
  );
}
