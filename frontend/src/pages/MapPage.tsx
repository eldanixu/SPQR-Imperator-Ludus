import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useGameStore } from '../store/useGameStore';
import GameHUD from '../components/game/GameHUD';
import EventoModal from '../components/game/EventoModal';
import RomanMap from '../components/map/RomanMap';
import { useGameFlow } from '../hooks/useGameFlow';
import axiosInstance from '../api/axiosInstance';

interface Provincia {
  id: number;
  nombre: string;
  nombreLatino: string;
  descripcion: string;
  capital: string;
  regionSvgId: string;
}

export default function MapPage() {
  const [isHovered, setIsHovered] = useState(false);
  const [sobornarError, setSobornarError] = useState(false);
  const sobornarTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { username, logout } = useAuthStore((state) => ({
    username: state.username,
    logout: state.logout,
  }));
  const modoJuego = useGameStore((state) => state.modoJuego);
  const { toggleModo, setEstado, eventoActual } = useGameStore();
  const { handleProvinciaClick: handleGameProvinciaClick } = useGameFlow();

  useEffect(() => {
    // Fetch provinces to display details in the side panel
    axiosInstance.get('/provincias')
      .then(res => {
        const data = res.data.data || res.data;
        setProvincias(data);
      })
      .catch(err => console.error('Error fetching provincias:', err));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleToggleModo = () => {
    const nuevoModo = !modoJuego;
    toggleModo();
    if (nuevoModo) {
      axiosInstance.get('/juego/estado')
        .then(res => {
          const data = res.data.data || res.data;
          setEstado(data);
        })
        .catch(err => console.error('Error fetching game state:', err));
    }
  };

  const handleSobornar = async () => {
    try {
      const res = await axiosInstance.post('/juego/sobornar');
      const data = res.data;
      if (data.success) {
        setEstado(data.data);
      } else {
        showSobornarError();
      }
    } catch {
      showSobornarError();
    }
  };

  const showSobornarError = () => {
    if (sobornarTimer.current) clearTimeout(sobornarTimer.current);
    setSobornarError(true);
    sobornarTimer.current = setTimeout(() => setSobornarError(false), 2000);
  };

  const handleProvinciaClick = useCallback((regionSvgId: string) => {
    console.log('click provincia:', regionSvgId, 'modoJuego:', modoJuego);
    setSelectedRegionId(regionSvgId);
    if (modoJuego) {
      handleGameProvinciaClick(regionSvgId);
    }
  }, [modoJuego, handleGameProvinciaClick]);

  const selectedProvincia = provincias.find(p => p.regionSvgId === selectedRegionId);

  const styles = {
    page: {
      backgroundColor: '#0d2137',
      minHeight: '100vh',
      color: 'white',
      display: 'flex',
      flexDirection: 'column' as const,
      fontFamily: 'sans-serif',
      overflow: 'hidden',
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 24px',
      height: '56px',
      background: 'linear-gradient(90deg, #1a0a00 0%, #2C1810 50%, #1a0a00 100%)',
      borderBottom: '2px solid #C9A84C',
      flexShrink: 0,
      whiteSpace: 'nowrap' as const,
    },
    navBrand: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '8px'
    },
    navTitle: {
      fontFamily: "'Cinzel', serif",
      color: '#C9A84C',
      margin: 0,
      fontSize: '24px',
      fontWeight: 'bold',
      letterSpacing: '4px',
    },
    navSubtitle: {
      fontFamily: "'Cinzel', serif",
      color: '#C9A84C',
      fontSize: '11px',
      letterSpacing: '2px',
      opacity: 0.8
    },
    navActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    welcomeText: {
      fontSize: '14px',
      color: '#8a7a5a',
    },
    separator: {
      color: '#C9A84C55',
      margin: '0 4px',
      fontSize: '18px',
    },
    toggleBtn: {
      backgroundColor: modoJuego ? '#C9A84C' : 'transparent',
      border: '1px solid #C9A84C',
      borderRadius: '4px',
      color: modoJuego ? '#1a0a00' : '#C9A84C',
      padding: '4px 12px',
      cursor: 'pointer',
      fontFamily: "'Cinzel', serif",
      fontSize: '12px',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
    },
    logoutBtn: {
      backgroundColor: isHovered ? '#C9A84C' : 'transparent',
      border: '1px solid #C9A84C',
      borderRadius: '4px',
      color: isHovered ? '#1a0a00' : '#C9A84C',
      padding: '4px 12px',
      cursor: 'pointer',
      fontFamily: "'Cinzel', serif",
      fontSize: '12px',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
    },
    main: {
      display: 'flex',
      height: 'calc(100vh - 56px)',
      width: '100%',
      position: 'relative' as const,
    },
    mapContainer: {
      flex: 1,
      height: '100%',
      width: '100%'
    },
    sidePanel: {
      width: '280px',
      height: 'calc(100vh - 56px)',
      background: 'linear-gradient(180deg, #1a0a00 0%, #0d0500 100%)',
      borderLeft: '1px solid #C9A84C',
      padding: '24px',
      boxSizing: 'border-box' as const,
      position: 'fixed' as const,
      right: 0,
      top: '56px',
      transform: selectedRegionId && selectedProvincia ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out',
      overflowY: 'auto' as const,
      boxShadow: '-4px 0 15px rgba(0,0,0,0.5)',
      zIndex: 10,
    },
    closeBtn: {
      position: 'absolute' as const,
      top: '16px',
      right: '16px',
      background: 'none',
      border: 'none',
      color: '#C9A84C',
      fontSize: '24px',
      cursor: 'pointer',
      padding: 0,
      lineHeight: 1,
    },
    panelTitle: {
      fontFamily: "'Cinzel', serif",
      color: '#C9A84C',
      marginTop: '8px',
      marginBottom: '4px',
      fontSize: '20px',
      fontWeight: 'normal',
    },
    panelSubtitle: {
      fontFamily: 'serif',
      color: '#8a7a5a',
      fontSize: '13px',
      fontStyle: 'italic',
      margin: '0 0 16px 0',
    },
    hr: {
      border: 'none',
      borderTop: '1px solid #C9A84C33',
      margin: '16px 0',
    },
    panelInfo: {
      color: '#c8b89a',
      fontSize: '14px',
      lineHeight: 1.6,
      marginBottom: '16px',
    },
    capitalLabel: {
      color: '#C9A84C',
      fontWeight: 'bold',
      fontSize: '14px',
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.navbar}>
        <div style={styles.navBrand}>
          <h1 style={styles.navTitle}>SPQR</h1>
          <span style={styles.navSubtitle}>IMPERATOR LUDUS</span>
        </div>
        <div style={styles.navActions}>
          <span style={styles.welcomeText}>Bienvenido {username || 'Imperator'}</span>
          <span style={styles.separator}>|</span>
          <button style={styles.toggleBtn} onClick={handleToggleModo}>
            {modoJuego ? 'Modo Historia' : 'Modo Imperator'}
          </button>
          {modoJuego && (
            <>
              <span style={styles.separator}>|</span>
              <button
                style={{
                  border: '1px solid #C9A84C',
                  color: '#C9A84C',
                  background: 'transparent',
                  borderRadius: '4px',
                  padding: '4px 12px',
                  cursor: 'pointer',
                  fontFamily: "'Cinzel', serif",
                  fontSize: '12px',
                  fontWeight: 'bold',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#C9A84C22')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                onClick={handleSobornar}
              >
                ⚖️ Sobornar (200🪙)
              </button>
            </>
          )}
          <span style={styles.separator}>|</span>
          <GameHUD />
          <span style={styles.separator}>|</span>
          <button
            style={{
              border: '1px solid #C9A84C',
              color: '#C9A84C',
              background: 'transparent',
              borderRadius: '4px',
              padding: '4px 12px',
              cursor: 'pointer',
              fontFamily: "'Cinzel', serif",
              fontSize: '12px',
              fontWeight: 'bold',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#C9A84C22')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            onClick={() => navigate('/ranking')}
          >
            🏆 Ranking
          </button>
          <span style={styles.separator}>|</span>
          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Logout
          </button>
        </div>
      </header>
      {sobornarError && (
        <div style={{
          position: 'absolute',
          top: '56px',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 100,
          padding: '8px 0',
          background: '#8B000099',
          color: '#ff6b6b',
          fontFamily: "'Cinzel', serif",
          fontSize: '13px',
          letterSpacing: '2px',
          borderBottom: '1px solid #8B0000',
          backdropFilter: 'blur(4px)',
        }}>
          ⚠️ Oro insuficiente para sobornar al Senado
        </div>
      )}
      <main style={styles.main}>
        <div style={styles.mapContainer}>
          <RomanMap 
            selectedRegionId={selectedRegionId} 
            onProvinciaClick={handleProvinciaClick} 
          />
        </div>
        
        <div style={styles.sidePanel}>
          <button style={styles.closeBtn} onClick={() => setSelectedRegionId(null)}>×</button>
          
          {selectedProvincia && (
            <>
              <h2 style={styles.panelTitle}>{selectedProvincia.nombre}</h2>
              <p style={styles.panelSubtitle}>{selectedProvincia.nombreLatino}</p>
              
              <hr style={styles.hr} />
              
              <div style={styles.panelInfo}>
                {selectedProvincia.descripcion}
              </div>
              
              <div>
                <span style={styles.capitalLabel}>Capital: </span>
                <span style={{ color: '#c8b89a', fontSize: '14px' }}>{selectedProvincia.capital}</span>
              </div>
            </>
          )}
        </div>
      </main>
      
      {eventoActual && (
        <EventoModal onClose={() => {
          useGameStore.getState().clearEvento();
          setSelectedRegionId(null);
        }} />
      )}
    </div>
  );
}
