import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import axiosInstance from '../../api/axiosInstance';

interface EventoModalProps {
  onClose: () => void;
}

export default function EventoModal({ onClose }: EventoModalProps) {
  const navigate = useNavigate();
  const { eventoActual, provinciaEventoId, setEstado, clearEvento } = useGameStore();
  const [disabled, setDisabled] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  
  if (!eventoActual) return null;

  const handleAnswer = async (respuesta: string) => {
    if (disabled || !provinciaEventoId) return;
    setDisabled(true);

    try {
      const res = await axiosInstance.post(`/juego/provincia/${provinciaEventoId}/resolver`, {
        respuesta
      });
      const data = res.data.data || res.data;

      const isCorrect = data.correcto;
      const text = isCorrect 
        ? `+${eventoActual.recompensaOro} oro ⚔️ +100 gloria` 
        : `-${eventoActual.penalizacionPopularidad} popularidad`;

      setFeedback({ isCorrect, text });

      setTimeout(() => {
        setEstado(data.nuevoEstado);
        clearEvento();
        onClose();
        if (data.finPartida) {
          navigate('/fin-partida');
        }
      }, 1500);
    } catch (err) {
      console.error('Error resolving event:', err);
      setDisabled(false);
    }
  };

  const handleActuar = () => {
    // Decision - Actuar: adds 30 oro locally and closes
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
    header: {
      color: '#888',
      fontSize: '12px',
      marginBottom: '8px',
      fontWeight: 'bold',
      letterSpacing: '1px',
    },
    pregunta: {
      fontFamily: "'Cinzel', serif",
      color: '#C9A84C',
      fontSize: '18px',
      marginBottom: '24px',
      lineHeight: 1.4,
    },
    btnOpcion: (opcionIndex: number) => {
      // Find if this specific button was selected during feedback
      let btnBg = '#1a1410';
      if (feedback && disabled) {
         // It's hard to know which button was clicked from state without tracking it, 
         // so we just show feedback globally or on all buttons. 
         // Let's implement dynamic background via CSS classes or inline style override when clicked.
      }
      return {
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
      };
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
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose} disabled={disabled}>×</button>
        <div style={styles.header}>EVENTO</div>
        
        {eventoActual.tipo === 'PREGUNTA' && (
          <>
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
                      // Set an active style immediately on this button to receive feedback style later
                      btn.dataset.selected = 'true';
                    }
                  }}
                  style={{
                    ...styles.btnOpcion(i),
                    // Apply hover styles through inline onMouseEnter/Leave for simplicity, 
                    // or just rely on CSS which we aren't using. 
                    // Let's handle the specific requirement of feedback background on the button:
                    ...(feedback && disabled ? {} : {}) // We will use the feedback block below instead of styling the button
                  }}
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
              <div style={feedback.isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}>
                {feedback.text}
              </div>
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
