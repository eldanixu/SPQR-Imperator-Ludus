import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

// Inject styles
const styleEl = document.createElement('style');
styleEl.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');
  @keyframes rankFadeIn {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes glowTitle {
    0%, 100% { text-shadow: 0 0 20px #C9A84C88, 0 2px 8px rgba(0,0,0,0.8); }
    50%       { text-shadow: 0 0 50px #C9A84Ccc, 0 0 20px #C9A84C88, 0 2px 8px rgba(0,0,0,0.8); }
  }
  .rank-root { animation: rankFadeIn 0.7s ease forwards; }
  .rank-title { animation: glowTitle 3s ease-in-out infinite; }
  .rank-row { transition: background 0.2s ease, transform 0.15s ease; }
  .rank-row:hover { background: #C9A84C11 !important; transform: translateX(4px); }
  .rank-back-btn:hover {
    background: #C9A84C22 !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(201,168,76,0.25);
  }
`;
if (!document.head.querySelector('#ranking-style')) {
  styleEl.id = 'ranking-style';
  document.head.appendChild(styleEl);
}

interface RankingDTO {
  username: string;
  gloriaMaxima: number;
  oroMaximo: number;
  mejorRacha: number;
  totalPartidas: number;
}

function positionBadge(pos: number) {
  if (pos === 1) return '👑';
  if (pos === 2) return '⚔️';
  if (pos === 3) return '🛡️';
  return `${pos}`;
}

function positionColor(pos: number) {
  if (pos === 1) return '#FFD700';
  if (pos === 2) return '#C0C0C0';
  if (pos === 3) return '#CD7F32';
  return '#8a7a5a';
}

export default function RankingPage() {
  const navigate = useNavigate();
  const [ranking, setRanking] = useState<RankingDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/juego/ranking')
      .then(res => {
        if (res.data.success) setRanking(res.data.data);
      })
      .catch(err => console.error('Error fetching ranking:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="rank-root"
      style={{
        background: 'radial-gradient(ellipse at top, #2C1810 0%, #0d0500 60%, #000 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px 20px 40px',
        fontFamily: "'Cinzel', serif",
        color: 'white',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏛️</div>
        <h1
          className="rank-title"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '36px',
            fontWeight: '900',
            color: '#C9A84C',
            letterSpacing: '6px',
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
          }}
        >
          Tabula Gloriae
        </h1>
        <p style={{
          color: '#6a5a4a',
          fontSize: '14px',
          letterSpacing: '3px',
          margin: 0,
          textTransform: 'uppercase',
        }}>
          Los mejores generales del Imperio
        </p>
        <div style={{
          width: '120px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
          margin: '20px auto 0',
        }} />
      </div>

      {/* Table */}
      <div style={{
        width: '100%',
        maxWidth: '760px',
        background: 'rgba(26,10,0,0.85)',
        border: '1px solid #C9A84C44',
        borderRadius: '10px',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        marginBottom: '40px',
      }}>
        {/* Table layout */}
        <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#C9A84C15', borderBottom: '1px solid #C9A84C44' }}>
            <tr>
              {[
                { label: 'Pos.', width: '50px', align: 'center' },
                { label: 'Legatus', width: '150px', align: 'left' },
                { label: 'Gloria ⚔️', width: '80px', align: 'left' },
                { label: 'Oro 🪙', width: '80px', align: 'left' },
                { label: 'Turnos', width: '80px', align: 'left' },
                { label: 'Partidas', width: '80px', align: 'left' }
              ].map(h => (
                <th key={h.label} style={{
                  width: h.width,
                  padding: '14px 20px',
                  color: '#C9A84C',
                  fontSize: '11px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  textAlign: h.align as any,
                  verticalAlign: 'middle',
                  whiteSpace: 'nowrap',
                }}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#6a5a4a', fontSize: '14px', letterSpacing: '2px' }}>
                  Consultando los archivos imperiales…
                </td>
              </tr>
            ) : ranking.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#6a5a4a', fontSize: '14px', letterSpacing: '2px' }}>
                  Aún no hay generales en el registro
                </td>
              </tr>
            ) : (
              ranking.map((entry, i) => {
                const pos = i + 1;
                const isTop3 = pos <= 3;
                return (
                  <tr
                    key={entry.username}
                    className="rank-row"
                    style={{
                      borderBottom: i < ranking.length - 1 ? '1px solid #C9A84C11' : 'none',
                      background: pos === 1 ? '#C9A84C08' : 'transparent',
                    }}
                  >
                    <td style={{
                      padding: '14px 20px',
                      fontSize: isTop3 ? '22px' : '16px',
                      color: positionColor(pos),
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}>
                      {positionBadge(pos)}
                    </td>
                    <td style={{
                      padding: '14px 20px',
                      color: pos === 1 ? '#FFD700' : '#e6ded4',
                      fontSize: '15px',
                      fontWeight: pos === 1 ? 'bold' : 'normal',
                      letterSpacing: '1px',
                      textAlign: 'left',
                    }}>
                      {entry.username}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#C9A84C', fontSize: '14px', fontWeight: 'bold', textAlign: 'left' }}>
                      {entry.gloriaMaxima.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#e6ded4', fontSize: '14px', textAlign: 'left' }}>
                      {entry.oroMaximo.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#8a7a5a', fontSize: '13px', textAlign: 'left' }}>
                      {entry.mejorRacha}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#8a7a5a', fontSize: '13px', textAlign: 'left' }}>
                      {entry.totalPartidas}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Back button */}
      <button
        className="rank-back-btn"
        onClick={() => navigate('/mapa')}
        style={{
          background: 'transparent',
          border: '1px solid #C9A84C',
          borderRadius: '6px',
          color: '#C9A84C',
          padding: '12px 36px',
          cursor: 'pointer',
          fontFamily: "'Cinzel', serif",
          fontSize: '14px',
          fontWeight: 'bold',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          transition: 'all 0.25s ease',
        }}
      >
        ← Volver al Mapa
      </button>
    </div>
  );
}
