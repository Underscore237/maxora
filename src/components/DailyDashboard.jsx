import React, { useState, useEffect } from 'react';
import { Flame, Check, Sparkles, Clock, ChevronRight, Lock, Trophy, Zap, Camera, Award, Info, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getTodayProgram, toggleProgramTask, advanceNextDay } from '../utils/api';

export default function DailyDashboard({ onOpenPaywall, onStartFollowupScan, userPlan }) {
  const [loading, setLoading] = useState(true);
  const [programData, setProgramData] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

  const isPaid = userPlan === 'glow_up_30' || userPlan === 'glow_up_90';

  const loadProgram = async () => {
    try {
      setLoading(true);
      const data = await getTodayProgram();
      setProgramData(data);
      setCompletedTasks(data.completedTasks || {});
      setStreak(data.streak || 0);
      setXp(data.xp || 0);
    } catch (err) {
      console.error('Erreur chargement programme:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgram();
  }, [userPlan]);

  const handleToggle = async (task, e) => {
    e.stopPropagation();
    const newStatus = !completedTasks[task.id];
    
    // Mise à jour optimiste locale
    const nextCompleted = { ...completedTasks, [task.id]: newStatus };
    setCompletedTasks(nextCompleted);

    // Si la tâche vient d'être cochée, petit son ou vibration si dispo
    if (newStatus && window.navigator?.vibrate) {
      window.navigator.vibrate(50);
    }

    try {
      const res = await toggleProgramTask(task.id, newStatus, task.xp || 20);
      if (res.success) {
        setXp(res.xp);
        setStreak(res.streak);

        // Vérifier si toutes les tâches du jour sont faites
        const allDone = programData.daySchedule?.tasks?.every(t => nextCompleted[t.id]);
        if (allDone && newStatus) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#10B981', '#F59E0B', '#FFFFFF']
          });
        }
      }
    } catch (err) {
      console.error('Erreur toggle tâche:', err);
    }
  };

  const handleNextDay = async () => {
    const res = await advanceNextDay();
    if (res.success) {
      loadProgram();
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ animation: 'spin 1s infinite linear', display: 'inline-block' }}>
          <Sparkles size={32} color="var(--gold-400)" />
        </div>
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Chargement de ton programme quotidien...</p>
      </div>
    );
  }

  const currentDay = programData?.currentDay || 1;
  const totalDays = programData?.totalDays || 30;
  const daySchedule = programData?.daySchedule;
  const tasks = daySchedule?.tasks || [];
  const completedCount = tasks.filter(t => completedTasks[t.id]).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      {/* BANNIÈRE DE PROGRESSION & STREAKS */}
      <div className="glass-card" style={{ padding: '24px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Programme personnalisé
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>
              Jour {currentDay} sur {totalDays}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="streak-pill" style={{ fontSize: '0.95rem', padding: '8px 14px' }}>
              <Flame size={18} fill="#FB923C" />
              <span>{streak} jours 🔥</span>
            </div>
            <div className="xp-pill" style={{ fontSize: '0.95rem', padding: '8px 14px' }}>
              <Zap size={18} fill="var(--gold-400)" />
              <span>{xp} XP</span>
            </div>
          </div>
        </div>

        {/* Barre de complétion du jour */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <span>Complétion des tâches du jour</span>
            <strong style={{ color: 'var(--gold-300)' }}>{completedCount} / {tasks.length} ({progressPercent}%)</strong>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${progressPercent}%`, 
                height: '100%', 
                background: 'var(--gold-gradient)', 
                borderRadius: '999px',
                transition: 'width 0.4s ease'
              }} 
            />
          </div>
        </div>

        {/* Focus de la semaine */}
        {daySchedule?.focus && (
          <div className="glass-surface" style={{ padding: '12px 16px', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: '3px solid var(--gold-400)' }}>
            <strong style={{ color: 'var(--gold-200)', display: 'block', marginBottom: '2px' }}>
              🎯 Focus : {daySchedule.title}
            </strong>
            {daySchedule.focus}
          </div>
        )}
      </div>

      {/* RAPPEL SCAN HEBDOMADAIRE SI J+7, J+14, ETC. */}
      {daySchedule?.isPhotoFollowupDay && (
        <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(10, 13, 20, 0.9) 100%)', borderColor: 'var(--emerald-500)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--emerald-500)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#FFF' }}>📸 Étape Clé : Scan Hebdomadaire (J+{currentDay})</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Mesure ton évolution et découvre tes points gagnés depuis ton premier scan !
                </p>
              </div>
            </div>

            <button className="btn-primary" onClick={onStartFollowupScan} style={{ background: 'var(--emerald-500)', color: '#000' }}>
              <span>Faire mon scan de suivi</span>
            </button>
          </div>
        </div>
      )}

      {/* CHECKLIST QUOTIDIENNE (SECTION 9 — STRICTEMENT LE JOUR COURANT) */}
      <h3 style={{ fontSize: '1.25rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>📋 Tes actions du jour ({tasks.length})</span>
      </h3>

      <div className="tasks-list">
        {tasks.map((task) => {
          const isDone = !!completedTasks[task.id];

          return (
            <div 
              key={task.id} 
              className={`glass-card task-card ${isDone ? 'completed' : ''}`}
              onClick={() => setSelectedTask(task)}
            >
              <div className="task-left">
                {/* Checkbox cochable */}
                <div 
                  className={`task-checkbox ${isDone ? 'checked' : ''}`}
                  onClick={(e) => handleToggle(task, e)}
                >
                  {isDone && <Check size={18} strokeWidth={3} />}
                </div>

                <div>
                  <h4 style={{ fontSize: '1rem', textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                    {task.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>⏱ {task.duration}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--gold-400)', fontWeight: 700 }}>+{task.xp} XP</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => setSelectedTask(task)}>
                  <Info size={14} />
                  <span>Détails</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Jour Suivant (Rétention) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Les tâches de demain seront débloquées à minuit.
        </span>
        <button className="btn-secondary" onClick={handleNextDay} style={{ fontSize: '0.85rem' }}>
          <span>Tester Jour Suivant ➔</span>
        </button>
      </div>

      {/* MODAL DE DÉTAIL D'UNE ACTION */}
      {selectedTask && (
        <div className="modal-backdrop" onClick={() => setSelectedTask(null)}>
          <div className="glass-card paywall-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div className="badge-gold">
                <Sparkles size={14} />
                <span>Guide d'Exécution</span>
              </div>
              <button className="btn-secondary" onClick={() => setSelectedTask(null)} style={{ padding: '6px', borderRadius: '50%' }}>
                <X size={18} />
              </button>
            </div>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{selectedTask.title}</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>⏱ Durée : <strong>{selectedTask.duration}</strong></span>
              <span>•</span>
              <span>⚡ Récompense : <strong>+{selectedTask.xp} XP</strong></span>
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.9rem', lineHeight: '1.6' }}>
              <strong style={{ color: 'var(--gold-300)', display: 'block', marginBottom: '6px' }}>Comment faire :</strong>
              {selectedTask.description}
            </div>

            <button 
              className="btn-primary" 
              onClick={(e) => {
                handleToggle(selectedTask, e);
                setSelectedTask(null);
              }}
              style={{ width: '100%' }}
            >
              <Check size={18} />
              <span>{completedTasks[selectedTask.id] ? "Marquer comme à refaire" : "Valider l'action (+ " + selectedTask.xp + " XP)"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
