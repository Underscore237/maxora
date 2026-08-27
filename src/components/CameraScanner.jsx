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
      setCameraError("Autorise l'accès à ta caméra ou importe une photo nette.");
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

  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 960;

    const ctx = canvas.getContext('2d');
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(base64);
  };

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
    <div className="camera-container">
      {/* 1. BARRE DE COMMANDE SUPÉRIEURE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', padding: '0 4px' }}>
        <button className="btn-secondary" onClick={onCancel} style={{ padding: '7px 12px', fontSize: '0.82rem', gap: '4px' }}>
          <ArrowLeft size={15} />
          <span>Retour</span>
        </button>

        <div className="badge-gold" style={{ fontSize: '0.75rem', padding: '5px 12px' }}>
          <Sparkles size={13} />
          <span>Scan IA Biométrique</span>
        </div>

        <button 
          className="btn-secondary" 
          onClick={toggleFacingMode} 
          style={{ padding: '7px 11px' }}
          title="Changer de caméra"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* 2. CADRE DE CAMÉRA PORTRAIT VERTICAL (PROPORTION PARFAITE 3:4) */}
      <div className="camera-frame-wrapper">
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
          <img 
            src={capturedImage} 
            alt="Capture pour analyse" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : isCameraActive ? (
          <>
            {/* Ovale de guidage centré */}
            <div className={`camera-oval-overlay ${isAligned ? 'aligned' : ''}`}>
              <div className="scanner-laser" />
            </div>

            {/* Conseil de positionnement en haut du cadre */}
            <div className="scanner-guidelines">
              💡 {tips[tipIndex]}
            </div>
          </>
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
            <AlertCircle size={44} color="var(--gold-400)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1rem', marginBottom: '6px' }}>Caméra en attente</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '16px' }}>
              {cameraError || "Autorise l'accès à ta caméra ou importe une photo nette."}
            </p>
            <label className="btn-primary" style={{ cursor: 'pointer', padding: '10px 18px', fontSize: '0.85rem' }}>
              <Upload size={16} />
              <span>Importer une photo</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>
        )}
      </div>

      {/* 3. CONTRÔLES DE PRISE DE VUE (SÉPARÉS DU CADRE VIDÉO) */}
      {capturedImage ? (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '16px' }}>
          <button className="btn-secondary" onClick={retakePhoto} style={{ flex: 1, padding: '12px' }}>
            <X size={17} />
            <span>Reprendre</span>
          </button>
          <button className="btn-primary" onClick={confirmPhoto} style={{ flex: 1.5, padding: '12px' }}>
            <Check size={17} />
            <span>Lancer l'analyse</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', alignItems: 'center', marginBottom: '18px' }}>
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
              boxShadow: '0 0 25px rgba(212, 175, 55, 0.65)'
            }}
            title="Prendre la photo"
          >
            <Camera size={28} color="#000" />
          </button>
        </div>
      )}

      {/* 4. CONSEILS EN BAS SANS SUPERPOSITION */}
      <div className="glass-surface" style={{ padding: '12px 14px', fontSize: '0.76rem', color: 'var(--text-secondary)', textAlign: 'left', borderRadius: 'var(--radius-md)' }}>
        <div style={{ fontWeight: 700, color: 'var(--gold-300)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldAlert size={14} />
          <span>Conditions pour un diagnostic IA précis :</span>
        </div>
        <div>✓ Visage de face, centré dans l'ovale et bien éclairé</div>
        <div>✓ Sans casquette, bonnet ni lunettes</div>
        <div>✓ Expression neutre (bouche fermée)</div>
      </div>
    </div>
  );
}
