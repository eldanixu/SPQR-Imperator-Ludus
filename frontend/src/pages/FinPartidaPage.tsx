import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import axiosInstance from '../api/axiosInstance';

// Inject styles
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes glowPulse {
    0%, 100% { text-shadow: 0 0 30px currentColor, 0 2px 8px rgba(0,0,0,0.8); }
    50%       { text-shadow: 0 0 60px currentColor, 0 0 20px currentColor, 0 2px 8px rgba(0,0,0,0.8); }
  }
  .fin-partida-root {
    animation: fadeInUp 0.9s ease forwards;
  }
  .fin-partida-title {
    animation: glowPulse 3s ease-in-out infinite;
  }
  .fin-stat-card:hover {
    transform: translateY(-4px);
    border-color: #C9A84C !important;
    box-shadow: 0 8px 24px rgba(201,168,76,0.15);
  }
  .fin-nueva-partida-btn:hover {
    background: linear-gradient(135deg, #C9A84C, #e8c96a) !important;
    color: #1a0a00 !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(201,168,76,0.4);
  }
  .fin-tr-even { background-color: #1a0a00; }
  .fin-tr-odd  { background-color: #0d0500; }
  .fin-tr-even:hover, .fin-tr-odd:hover {
    background-color: #2C1810;
  }
`;
if (!document.head.querySelector('#fin-partida-style')) {
  styleEl.id = 'fin-partida-style';
  document.head.appendChild(styleEl);
}

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
  let subtituloLatino = "Finis est initium novum";

  if (tipoFin === "VICTORIA") {
    titulo = "AVE IMPERATOR";
    colorTitulo = "#C9A84C";
    subtituloLatino = "Gloria aeternam Romam coronat";
  } else if (tipoFin === "DERROTA_POPULARIDAD") {
    titulo = "EL SENADO TE HA EXILIADO";
    colorTitulo = "#8B0000";
    subtituloLatino = "Sic transit gloria mundi";
  } else if (tipoFin === "DERROTA_BANCARROTA") {
    titulo = "ROMA ESTÁ EN BANCARROTA";
    colorTitulo = "#8B0000";
    subtituloLatino = "Pecunia nervus belli est";
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

  const stats = [
    { label: 'Oro', value: `🪙 ${oro}`, emoji: '🪙' },
    { label: 'Gloria', value: `⚔️ ${gloria}`, emoji: '⚔️' },
    { label: 'Popularidad', value: `👑 ${popularidad}`, emoji: '👑' },
    { label: 'Turnos', value: `📜 ${turno}`, emoji: '📜' },
  ];

  return (
    <div
      className="fin-partida-root"
      style={{
        background: 'radial-gradient(ellipse at center, #2C1810 0%, #0d0500 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: "'Cinzel', serif",
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      {/* Título principal */}
      <h1
        className="fin-partida-title"
        style={{
          fontFamily: "'Cinzel', serif",
          color: colorTitulo,
          fontSize: '52px',
          marginBottom: '8px',
          letterSpacing: '5px',
          fontWeight: 'bold',
          lineHeight: 1.1,
        }}
      >
        {titulo}
      </h1>

      {/* Subtítulo latino */}
      <p style={{
        fontFamily: "'Cinzel', serif",
        color: '#8a7a5a',
        fontSize: '13px',
        letterSpacing: '4px',
        marginBottom: '48px',
        textTransform: 'uppercase',
        fontStyle: 'italic',
      }}>
        {subtituloLatino}
      </p>

      {/* Stats en grid 2x2 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '40px',
        width: '100%',
        maxWidth: '480px',
      }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="fin-stat-card"
            style={{
              background: '#1a0a00',
              border: '1px solid #C9A84C33',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.25s ease',
              cursor: 'default',
            }}
          >
            <span style={{
              fontFamily: "'Cinzel', serif",
              color: '#C9A84C',
              fontSize: '36px',
              fontWeight: 'bold',
              lineHeight: 1,
            }}>
              {stat.value}
            </span>
            <span style={{
              color: '#6a5a4a',
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Historial */}
      <div style={{
        marginBottom: '40px',
        width: '100%',
        maxWidth: '640px',
        background: 'rgba(26,10,0,0.8)',
        border: '1px solid #C9A84C33',
        borderRadius: '8px',
        overflow: 'hidden',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #C9A84C33',
        }}>
          <h3 style={{
            fontFamily: "'Cinzel', serif",
            color: '#C9A84C',
            fontSize: '16px',
            letterSpacing: '3px',
            margin: 0,
            textTransform: 'uppercase',
          }}>
            Historial de Partidas
          </h3>
        </div>

        {historial.length > 0 ? (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            color: '#e6ded4',
            fontFamily: "'Cinzel', serif",
          }}>
            <thead>
              <tr style={{ background: '#C9A84C15' }}>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  color: '#C9A84C',
                  fontSize: '11px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  borderBottom: '1px solid #C9A84C44',
                }}>Resultado</th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  color: '#C9A84C',
                  fontSize: '11px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  borderBottom: '1px solid #C9A84C44',
                }}>Gloria</th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  color: '#C9A84C',
                  fontSize: '11px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  borderBottom: '1px solid #C9A84C44',
                }}>Turnos</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((h, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'fin-tr-even' : 'fin-tr-odd'}
                  style={{ transition: 'background 0.2s ease' }}
                >
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '12px',
                    letterSpacing: '1px',
                    color: h.resultado === 'VICTORIA' ? '#C9A84C' : '#C0392B',
                    borderBottom: '1px solid #C9A84C11',
                  }}>
                    {h.resultado}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#e6ded4',
                    borderBottom: '1px solid #C9A84C11',
                  }}>
                    {h.gloriaFinal}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#e6ded4',
                    borderBottom: '1px solid #C9A84C11',
                  }}>
                    {h.turnos}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{
            color: '#6a5a4a',
            fontStyle: 'italic',
            fontSize: '13px',
            letterSpacing: '2px',
            padding: '24px',
            margin: 0,
          }}>
            Sin partidas anteriores
          </p>
        )}
      </div>

      {/* Botones */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          className="fin-nueva-partida-btn"
          onClick={handleNuevaPartida}
          style={{
            background: 'transparent',
            border: '2px solid #C9A84C',
            borderRadius: '6px',
            color: '#C9A84C',
            padding: '16px 48px',
            cursor: 'pointer',
            fontFamily: "'Cinzel', serif",
            fontSize: '18px',
            fontWeight: 'bold',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease',
          }}
        >
          Nueva Partida
        </button>
        <button
          onClick={() => navigate('/ranking')}
          style={{
            background: 'transparent',
            border: '2px solid #C9A84C44',
            borderRadius: '6px',
            color: '#C9A84C',
            padding: '16px 36px',
            cursor: 'pointer',
            fontFamily: "'Cinzel', serif",
            fontSize: '16px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease',
            opacity: 0.85,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#C9A84C';
            (e.currentTarget as HTMLButtonElement).style.opacity = '1';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#C9A84C44';
            (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
          }}
        >
          🏆 Ver Ranking
        </button>
      </div>
    </div>
  );
}
