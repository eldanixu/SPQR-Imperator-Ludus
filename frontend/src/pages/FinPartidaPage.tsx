import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import axiosInstance from '../api/axiosInstance';

interface HistorialDTO {
  oroFinal: number;
  gloriaFinal: number;
  popularidadFinal: number;
  turnos: number;
  resultado: string;
  createdAt: string;
}

export default function FinPartidaPage() {
  const navigate = useNavigate();
  const { tipoFin, oro, gloria, popularidad, turno, resetStore } = useGameStore();
  const [historial, setHistorial] = useState<HistorialDTO[]>([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await axiosInstance.get('/juego/historial');
        if (response.data.success) {
          setHistorial(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching historial:', err);
      }
    };
    fetchHistorial();
  }, []);

  let titulo = "FIN DE LA PARTIDA";
  let colorTitulo = "#C9A84C";
  let subtitulo = "";

  if (tipoFin === "VICTORIA") {
    titulo = "AVE IMPERATOR";
    colorTitulo = "#C9A84C";
    subtitulo = "Has conquistado el Imperio";
  } else if (tipoFin === "DERROTA_POPULARIDAD") {
    titulo = "EL SENADO TE HA EXILIADO";
    colorTitulo = "#8B0000";
  } else if (tipoFin === "DERROTA_BANCARROTA") {
    titulo = "ROMA ESTÁ EN BANCARROTA";
    colorTitulo = "#8B0000";
  }

  const handleNuevaPartida = async () => {
    try {
      await axiosInstance.post('/juego/reset');
    } catch (err) {
      console.error('Error resetting game:', err);
    } finally {
      resetStore();
      navigate('/mapa');
    }
  };

  const styles = {
    page: {
      backgroundColor: '#1a1410',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'sans-serif',
      padding: '20px',
      textAlign: 'center' as const,
    },
    title: {
      fontFamily: "'Cinzel', serif",
      color: colorTitulo,
      fontSize: '3rem',
      marginBottom: subtitulo ? '10px' : '40px',
      letterSpacing: '2px',
    },
    subtitle: {
      fontFamily: "'Cinzel', serif",
      color: '#e6ded4',
      fontSize: '1.5rem',
      marginBottom: '40px',
      letterSpacing: '1px',
    },
    statsContainer: {
      backgroundColor: '#2C2518',
      border: '2px solid #C9A84C',
      borderRadius: '8px',
      padding: '32px',
      marginBottom: '40px',
      minWidth: '300px',
    },
    statRow: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '12px 0',
      fontSize: '1.2rem',
    },
    statLabel: {
      color: '#e6ded4',
      marginRight: '20px',
    },
    statValue: {
      fontFamily: "'Cinzel', serif",
      color: '#C9A84C',
      fontWeight: 'bold',
    },
    historyContainer: {
      marginBottom: '40px',
      width: '100%',
      maxWidth: '600px',
      backgroundColor: '#2C2518',
      border: '1px solid #C9A84C',
      borderRadius: '8px',
      padding: '20px',
    },
    historyTitle: {
      fontFamily: "'Cinzel', serif",
      color: '#C9A84C',
      fontSize: '1.5rem',
      marginBottom: '20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      color: '#e6ded4',
    },
    th: {
      borderBottom: '2px solid #C9A84C',
      padding: '10px',
      textAlign: 'left' as const,
      fontFamily: "'Cinzel', serif",
      color: '#C9A84C',
    },
    td: {
      padding: '10px',
      borderBottom: '1px solid #4a3e2a',
      textAlign: 'left' as const,
    },
    emptyText: {
      color: '#e6ded4',
      fontStyle: 'italic',
      marginTop: '10px',
    },
    button: {
      backgroundColor: 'transparent',
      border: '2px solid #C9A84C',
      borderRadius: '4px',
      color: '#C9A84C',
      padding: '12px 32px',
      cursor: 'pointer',
      fontFamily: "'Cinzel', serif",
      fontSize: '1.2rem',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>{titulo}</h1>
      {subtitulo && <h2 style={styles.subtitle}>{subtitulo}</h2>}
      
      <div style={styles.statsContainer}>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>Oro final:</span>
          <span style={styles.statValue}>🪙 {oro}</span>
        </div>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>Gloria final:</span>
          <span style={styles.statValue}>⚔️ {gloria}</span>
        </div>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>Popularidad final:</span>
          <span style={styles.statValue}>👑 {popularidad}</span>
        </div>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>Turnos jugados:</span>
          <span style={styles.statValue}>📜 {turno}</span>
        </div>
      </div>

      <div style={styles.historyContainer}>
        <h3 style={styles.historyTitle}>Tus últimas partidas</h3>
        {historial.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Resultado</th>
                <th style={styles.th}>Gloria</th>
                <th style={styles.th}>Turnos</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((h, index) => (
                <tr key={index}>
                  <td style={styles.td}>{h.resultado}</td>
                  <td style={styles.td}>{h.gloriaFinal}</td>
                  <td style={styles.td}>{h.turnos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={styles.emptyText}>Sin partidas anteriores</p>
        )}
      </div>

      <button 
        style={styles.button} 
        onClick={handleNuevaPartida}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#C9A84C';
          e.currentTarget.style.color = '#1a1410';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#C9A84C';
        }}
      >
        Nueva Partida
      </button>
    </div>
  );
}
