import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Upload, Sparkles, AlertCircle, ArrowLeft, Check, X, ShieldAlert } from 'lucide-react';

export default function CameraScanner({ onPhotoCaptured, onCancel }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    "Cadre bien ton visage au centre de l'ovale",
    "Retire ta casquette ou bonnet pour dégager le front",
    "Retire tes lunettes de soleil",
    "Mets-toi face à la lumière naturelle"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

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
      } catch (e) {
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
          videoRef.current.play().catch(err => console.log('Autoplay handled:', err));
        };
      }
    } catch (err) {
      console.warn('Accès caméra:', err);
      setCameraError("Autorise l'accès caméra ou importe une photo depuis ta galerie.");
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
    startCamera(facingMode);
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
    <div className="camera-container" style={{ maxWidth: '420px', margin: '0 auto', textAlign: 'center' }}>
      {/* 1. BARRE SUPÉRIEURE */}
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

      {/* 2. CADRE DE CAMÉRA PORTRAIT VERTICAL (PUR & SANS SUPERPOSITIONS) */}
      <div 
        className="camera-frame-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '360px',
          margin: '0 auto 16px',
          aspectRatio: '3/4',
          height: 'clamp(380px, 60vh, 480px)',
          borderRadius: '24px',
          overflow: 'hidden',
          background: '#04060a',
          border: '2px solid var(--border-gold)',
          boxShadow: '0 0 35px rgba(212, 175, 55, 0.25), 0 10px 30px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Balise vidéo plein cadre */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          webkit-playsinline="true"
          style={{ 
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: capturedImage ? 'none' : 'block',
            transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
            zIndex: 1
          }}
        />

        {capturedImage ? (
          <img 
            src={capturedImage} 
            alt="Capture pour analyse" 
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2 }}
          />
        ) : (
          <>
            {/* Ovale de cadrage centré */}
            <div className="camera-oval-overlay" style={{ zIndex: 5 }}>
              <div className="scanner-laser" />
            </div>

            {/* Bulle conseil légère en haut du cadre */}
            <div 
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(8, 11, 19, 0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '999px',
                padding: '6px 14px',
                color: '#FFF',
                fontSize: '0.74rem',
                fontWeight: 700,
                zIndex: 10,
                whiteSpace: 'nowrap',
                maxWidth: '92%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
              }}
            >
              💡 {tips[tipIndex]}
            </div>
          </>
        )}
      </div>

      {/* 3. CONTRÔLES DE PRISE DE VUE (SÉPARÉS DU CADRE) */}
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
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', marginBottom: '18px' }}>
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

      {/* 4. CONSEILS EN BAS SANS RECOUVREMENT */}
      <div className="glass-surface" style={{ padding: '12px 14px', fontSize: '0.76rem', color: 'var(--text-secondary)', textAlign: 'left', borderRadius: 'var(--radius-md)' }}>
        <div style={{ fontWeight: 700, color: 'var(--gold-300)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldAlert size={14} />
          <span>Conditions pour un diagnostic IA précis :</span>
        </div>
        <div>✓ Visage de face, centré dans l'ovale et bien éclairé</div>
        <div>✓ Sans casquette, bonnet ni lunettes de soleil</div>
        <div>✓ Expression neutre (bouche fermée)</div>
      </div>
    </div>
  );
}
