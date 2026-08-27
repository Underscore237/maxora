import React, { useState } from 'react';
import { X, Check, Crown, Sparkles, Smartphone, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { PRICING_PLANS, PAYMENT_METHODS } from '../data/plans.js';
import { simulatePaymentSuccess } from '../utils/api';
import WaterRippleOverlay, { useWaterRipple } from './WaterDropEffect';

export default function PaywallModal({ isOpen, onClose, onPlanActivated, currentPlan }) {
  const [selectedPlanId, setSelectedPlanId] = useState('glow_up_90');
  const [selectedOperator, setSelectedOperator] = useState('orange_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('CI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Hooks d'ondulations d'eau calmes et locales par bloc
  const plan30Ripple = useWaterRipple();
  const plan90Ripple = useWaterRipple();
  const operatorRipples = {
    orange_money: useWaterRipple(),
    mtn_momo: useWaterRipple(),
    wave: useWaterRipple(),
    moov_money: useWaterRipple()
  };

  if (!isOpen) return null;

  const handleSelectPlan30 = (e) => {
    plan30Ripple.triggerRipple(e, 'gold');
    setSelectedPlanId('glow_up_30');
  };

  const handleSelectPlan90 = (e) => {
    plan90Ripple.triggerRipple(e, 'gold');
    setSelectedPlanId('glow_up_90');
  };

  const handleSelectOperator = (opId, e) => {
    if (operatorRipples[opId]) {
      operatorRipples[opId].triggerRipple(e, 'gold');
    }
    setSelectedOperator(opId);
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      alert("Veuillez saisir votre numéro de téléphone Mobile Money.");
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise(r => setTimeout(r, 2000));

      const res = await simulatePaymentSuccess(selectedPlanId, `TXN_${Date.now()}`);
      if (res.success) {
        setPaymentSuccess(true);
        setTimeout(() => {
          onPlanActivated(res.user);
          onClose();
          setPaymentSuccess(false);
        }, 1800);
      }
    } catch (err) {
      console.error('Erreur paiement:', err);
      alert("Erreur de validation Mobile Money. Réessayez.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="glass-card paywall-modal" onClick={e => e.stopPropagation()}>
        {/* En-tête Paywall */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div className="badge-gold">
            <Crown size={14} />
            <span>Pass Élite • Débloque Ton Plein Potentiel</span>
          </div>

          <button className="btn-secondary" onClick={onClose} style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <h2 style={{ fontSize: '1.85rem', textAlign: 'center', marginBottom: '6px' }}>
          Active Ton <span className="text-gold-gradient">Glow Up Complet</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.88rem', marginBottom: '24px' }}>
          Paiement sécurisé instantané par Mobile Money (Orange, MTN, Wave, Moov).
        </p>

        {paymentSuccess ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--emerald-500)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: 'var(--emerald-glow)' }}>
              <Check size={44} strokeWidth={3} />
            </div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '10px' }}>Paiement Confirmé !</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Ton accès au programme <strong>{PRICING_PLANS[selectedPlanId]?.name}</strong> est maintenant actif.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePay}>
            {/* GRILLE DES OFFRES AVEC ONDULATIONS LOCALISÉES & BADGE POSITIONNÉ PROPREMENT */}
            <div className="plans-container" style={{ gap: '16px' }}>
              {/* OFFRE 30 JOURS */}
              <div 
                className={`plan-card water-ripple-target ${selectedPlanId === 'glow_up_30' ? 'selected' : ''}`}
                onClick={handleSelectPlan30}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                {/* Ondulation d'eau douce localisée uniquement dans cette carte */}
                <WaterRippleOverlay ripples={plan30Ripple.ripples} />

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Glow Up 30 Jours</h3>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid var(--gold-400)', background: selectedPlanId === 'glow_up_30' ? 'var(--gold-400)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '0.75rem', fontWeight: 900 }}>
                      {selectedPlanId === 'glow_up_30' && '✓'}
                    </div>
                  </div>

                  <div className="plan-price-tag">3 000 <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>FCFA/mois</span></div>
                  
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>✓ Programme d'action complet J1 à J30</div>
                    <div>✓ Preview "Glow Up Maxé" HD débloquée</div>
                    <div>✓ Suivi photo hebdomadaire J+7 / J+14</div>
                    <div>✓ Recettes de parfums locaux & sillage</div>
                  </div>
                </div>
              </div>

              {/* OFFRE 90 JOURS (MEILLEURE VALEUR - AVEC BADGE PROPRE ET NON SUPERPOSÉ) */}
              <div 
                className={`plan-card water-ripple-target ${selectedPlanId === 'glow_up_90' ? 'selected' : ''}`}
                onClick={handleSelectPlan90}
                style={{ position: 'relative', overflow: 'hidden', paddingTop: '28px' }}
              >
                {/* Ondulation d'eau douce localisée uniquement dans cette carte */}
                <WaterRippleOverlay ripples={plan90Ripple.ripples} />

                {/* Badge Meilleure Valeur propre au-dessus sans chevauchement */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: '8px', 
                    right: '12px', 
                    background: 'var(--gold-gradient)', 
                    color: '#000', 
                    fontSize: '0.68rem', 
                    fontWeight: 900, 
                    padding: '3px 9px', 
                    borderRadius: '999px',
                    boxShadow: '0 0 12px rgba(212, 175, 55, 0.5)',
                    zIndex: 3
                  }}
                >
                  👑 MEILLEURE VALEUR
                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Glow Up 90 Jours</h3>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid var(--gold-400)', background: selectedPlanId === 'glow_up_90' ? 'var(--gold-400)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '0.75rem', fontWeight: 900 }}>
                      {selectedPlanId === 'glow_up_90' && '✓'}
                    </div>
                  </div>

                  <div className="plan-price-tag">7 500 <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>FCFA unique</span></div>
                  
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ color: 'var(--gold-300)', fontWeight: 800 }}>★ Tout le pack 30J inclus (3 mois de suivi)</div>
                    <div>✓ Coaching morphologique approfondi</div>
                    <div>✓ Accès prioritaire communauté VIP</div>
                    <div>✓ Économise 1 500 FCFA vs mensuel</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SÉLECTION OPÉRATEUR MOBILE MONEY AVEC ONDULATION LOCALE */}
            <div style={{ marginTop: '22px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--gold-200)', display: 'block', marginBottom: '8px' }}>
                Choisis ton opérateur Mobile Money :
              </label>

              <div className="operators-grid">
                {PAYMENT_METHODS.map(op => (
                  <button
                    key={op.id}
                    type="button"
                    className={`operator-btn water-ripple-target ${selectedOperator === op.id ? 'selected' : ''}`}
                    onClick={(e) => handleSelectOperator(op.id, e)}
                    style={{ position: 'relative', overflow: 'hidden' }}
                  >
                    <WaterRippleOverlay ripples={operatorRipples[op.id]?.ripples} />
                    <Smartphone size={18} color={selectedOperator === op.id ? 'var(--gold-300)' : 'var(--text-muted)'} style={{ position: 'relative', zIndex: 2 }} />
                    <span style={{ position: 'relative', zIndex: 2 }}>{op.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* NUMÉRO DE TÉLÉPHONE */}
            <div style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--gold-200)', display: 'block', marginBottom: '8px' }}>
                Numéro de téléphone Mobile Money :
              </label>
              <input 
                type="tel"
                className="input-styled"
                placeholder="Ex : +225 07 00 00 00 / +237 6 90 00 00 00"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            {/* BOUTON DE PAIEMENT */}
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isProcessing}
              style={{ width: '100%', marginTop: '22px', padding: '16px' }}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Validation Mobile Money en cours...</span>
                </>
              ) : (
                <>
                  <Crown size={18} />
                  <span>Valider mon abonnement ({PRICING_PLANS[selectedPlanId]?.priceFCFA} FCFA)</span>
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="var(--emerald-500)" />
              <span>Paiement chiffré via CinetPay / FedaPay • Validation sans frais</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
