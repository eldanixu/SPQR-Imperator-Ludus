import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import axiosInstance from '../../api/axiosInstance';

interface EventoModalProps {
  onClose: () => void;
  provinciaNombre?: string;
}

export default function EventoModal({ onClose, provinciaNombre }: EventoModalProps) {
  const navigate = useNavigate();
  const { eventoActual, provinciaEventoId, setEstado, clearEvento } = useGameStore();
  const [disabled, setDisabled] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string; narracion?: string } | null>(null);
  const [showContinue, setShowContinue] = useState(false);
  const [resolverData, setResolverData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  
  useEffect(() => {
    if (eventoActual?.tipo === 'PREGUNTA') {
      setTimeLeft(30);
    }
  }, [eventoActual]);

  useEffect(() => {
    if (!eventoActual || eventoActual.tipo !== 'PREGUNTA' || disabled) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [eventoActual, disabled]);

  useEffect(() => {
    if (timeLeft === 0 && !disabled && eventoActual?.tipo === 'PREGUNTA') {
      handleAnswer('TIMEOUT');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, disabled, eventoActual]);
  
  if (!eventoActual) return null;

  const handleAnswer = async (respuesta: string) => {
    if (disabled || !provinciaEventoId) return;
    setDisabled(true);

    try {
      const res = await axiosInstance.post(`/juego/provincia/${provinciaEventoId}/resolver`, {
        respuesta,
        preguntaId: eventoActual.preguntaId ?? null
      });
      const data = res.data.data || res.data;

      const isCorrect = data.correcto;
      const text = isCorrect 
        ? `+${eventoActual.recompensaOro} oro ⚔️ +100 gloria` 
        : `-${eventoActual.penalizacionPopularidad} popularidad`;

      setFeedback({ isCorrect, text, narracion: data.narracion });

      setResolverData(data);
      setTimeout(() => {
        setShowContinue(true);
      }, 1500);
    } catch (err) {
      console.error('Error resolving event:', err);
      setDisabled(false);
    }
  };

  const handleContinue = () => {
    if (resolverData) {
      setEstado(resolverData.nuevoEstado);
      clearEvento();
      onClose();
      if (resolverData.finPartida) {
        navigate('/fin-partida');
      }
    }
  };

  const handleActuar = () => {
    const estadoActual = useGameStore.getState();
    setEstado({
      oro: estadoActual.oro + 30,
      gloria: estadoActual.gloria,
      popularidad: estadoActual.popularidad,
      turno: estadoActual.turno,
      provinciaActualId: estadoActual.provinciaActualId,
      partidaActiva: true
    });
    clearEvento();
    onClose();
  };

  const handleIgnorar = () => {
    clearEvento();
    onClose();
  };

  const styles = {
    overlay: {
      position: 'fixed' as const,
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modal: {
      position: 'relative' as const,
      backgroundColor: '#2C2518',
      border: '2px solid #C9A84C',
      borderRadius: '8px',
      padding: '32px',
      maxWidth: '600px',
      width: '90%',
      fontFamily: 'sans-serif',
    },
    closeBtn: {
      position: 'absolute' as const,
      top: '12px',
      right: '16px',
      background: 'none',
      border: 'none',
      color: '#C9A84C',
      fontSize: '24px',
      cursor: 'pointer',
    },
    provinciaTitulo: {
      fontFamily: "'Cinzel', serif",
      color: '#C9A84C',
      fontSize: '22px',
      fontWeight: 'bold',
      letterSpacing: '2px',
      textAlign: 'center' as const,
      marginBottom: '4px',
      textShadow: '0 0 12px rgba(201,168,76,0.4)',
    },
    provinciaDivider: {
      border: 'none',
      borderTop: '1px solid rgba(201,168,76,0.3)',
      margin: '10px 0 20px 0',
    },
    header: {
      color: '#888',
      fontSize: '11px',
      marginBottom: '8px',
      fontWeight: 'bold',
      letterSpacing: '2px',
      textTransform: 'uppercase' as const,
    },
    timerDisplay: {
      fontFamily: "'Cinzel', serif",
      fontSize: '24px',
      textAlign: 'center' as const,
      marginBottom: '20px',
      color: timeLeft <= 10 ? '#cc2200' : '#C9A84C',
      fontWeight: 'bold',
      transition: 'color 0.3s ease',
      textShadow: timeLeft <= 10 ? '0 0 8px rgba(204, 34, 0, 0.4)' : '0 0 8px rgba(201, 168, 76, 0.2)',
    },
    pregunta: {
      fontFamily: "'Cinzel', serif",
      color: '#C9A84C',
      fontSize: '18px',
      marginBottom: '24px',
      lineHeight: 1.4,
    },
    btnOpcion: (_opcionIndex: number) => ({
      width: '100%',
      margin: '6px 0',
      padding: '12px',
      backgroundColor: '#1a1410',
      border: '1px solid rgba(201, 168, 76, 0.33)',
      color: 'white',
      cursor: disabled ? 'default' : 'pointer',
      textAlign: 'left' as const,
      fontSize: '16px',
      fontFamily: 'sans-serif',
      transition: 'all 0.2s ease',
    }),
    narracionBox: {
      border: '1px solid #C9A84C33',
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: '12px',
      fontStyle: 'italic' as const,
      color: '#d4af6a',
      fontSize: '14px',
      lineHeight: 1.7,
      borderRadius: '6px',
      marginTop: '12px',
      letterSpacing: '0.3px',
    },
    feedbackCorrect: {
      backgroundColor: '#2d5a27',
      color: 'white',
      padding: '16px',
      textAlign: 'center' as const,
      borderRadius: '4px',
      marginTop: '16px',
      fontFamily: "'Cinzel', serif",
      fontWeight: 'bold',
    },
    feedbackIncorrect: {
      backgroundColor: '#5a1a1a',
      color: 'white',
      padding: '16px',
      textAlign: 'center' as const,
      borderRadius: '4px',
      marginTop: '16px',
      fontFamily: "'Cinzel', serif",
      fontWeight: 'bold',
    },
    continueBtn: {
      width: '100%',
      margin: '16px 0 0 0',
      padding: '14px 32px',
      backgroundColor: '#C9A84C',
      border: '2px solid #C9A84C',
      borderRadius: '4px',
      color: '#1a1410',
      cursor: 'pointer',
      textAlign: 'center' as const,
      fontSize: '16px',
      fontFamily: "'Cinzel', serif",
      fontWeight: 'bold',
      letterSpacing: '1px',
      transition: 'all 0.2s ease',
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose} disabled={disabled}>×</button>

        {/* Título con nombre de la provincia */}
        {provinciaNombre && (
          <>
            <div style={styles.provinciaTitulo}>{provinciaNombre}</div>
            <hr style={styles.provinciaDivider} />
          </>
        )}

        <div style={styles.header}>Evento</div>
        
        {eventoActual.tipo === 'PREGUNTA' && (
          <>
            <div style={styles.timerDisplay}>
              {timeLeft}s
            </div>
            <div style={styles.pregunta}>{eventoActual.pregunta}</div>
            
            {eventoActual.opciones?.map((opcion, i) => {
              const letter = String.fromCharCode(65 + i); // A, B, C, D
              return (
                <button
                  key={letter}
                  disabled={disabled}
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    if (!disabled) {
                      handleAnswer(letter);
                      btn.dataset.selected = 'true';
                    }
                  }}
                  style={styles.btnOpcion(i)}
                  onMouseEnter={(e) => {
                    if (!disabled) e.currentTarget.style.borderColor = '#C9A84C';
                  }}
                  onMouseLeave={(e) => {
                    if (!disabled) e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.33)';
                  }}
                >
                  {letter}) {opcion}
                </button>
              );
            })}
            
            {feedback && (
              <>
                <div style={feedback.isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}>
                  <div>{feedback.text}</div>
                </div>
                {feedback.narracion && (
                  <div style={styles.narracionBox}>
                    <span style={{ color: '#C9A84C', fontStyle: 'normal', fontSize: '11px', letterSpacing: '2px', fontFamily: "'Cinzel', serif", display: 'block', marginBottom: '6px' }}>NARRACIÓN</span>
                    {feedback.narracion}
                  </div>
                )}
              </>
            )}
            
            {showContinue && (
              <button 
                onClick={handleContinue}
                style={styles.continueBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e0c070';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(201,168,76,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#C9A84C';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Continuar →
              </button>
            )}
          </>
        )}

        {eventoActual.tipo === 'DECISION' && (
          <>
            <div style={styles.pregunta}>{eventoActual.descripcion}</div>
            <button 
              onClick={handleActuar}
              style={{...styles.btnOpcion(0), textAlign: 'center'}}
            >
              Actuar
            </button>
            <button 
              onClick={handleIgnorar}
              style={{...styles.btnOpcion(1), textAlign: 'center'}}
            >
              Ignorar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
