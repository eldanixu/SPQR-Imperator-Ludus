import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import RomanMap from '../components/map/RomanMap';
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
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { username, logout } = useAuthStore((state) => ({
    username: state.username,
    logout: state.logout,
  }));

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

  const handleProvinciaClick = (regionSvgId: string) => {
    setSelectedRegionId(regionSvgId);
  };

  const selectedProvincia = provincias.find(p => p.regionSvgId === selectedRegionId);

  const styles = {
    page: {
      backgroundColor: '#1a1410',
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
      padding: '0 32px',
      height: '60px',
      backgroundColor: '#2C2518',
      borderBottom: '1px solid #C9A84C',
      boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
      flexShrink: 0,
    },
    navTitle: {
      fontFamily: "'Cinzel', serif",
      color: '#C9A84C',
      margin: 0,
      fontSize: '1.5rem',
      letterSpacing: '1px',
    },
    navActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    welcomeText: {
      fontSize: '1rem',
      color: '#e6ded4',
    },
    logoutBtn: {
      backgroundColor: isHovered ? '#C9A84C' : 'transparent',
      border: '1px solid #C9A84C',
      borderRadius: '4px',
      color: isHovered ? '#1a1410' : '#C9A84C',
      padding: '8px 16px',
      cursor: 'pointer',
      fontFamily: "'Cinzel', serif",
      fontSize: '0.9rem',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
    },
    main: {
      display: 'flex',
      height: 'calc(100vh - 60px)',
      width: '100%',
      position: 'relative' as const,
    },
    mapContainer: {
      flex: 1,
      height: '100%',
    },
    sidePanel: {
      width: '300px',
      height: '100%',
      backgroundColor: '#2C2518',
      borderLeft: '1px solid #C9A84C',
      padding: '24px',
      boxSizing: 'border-box' as const,
      position: 'absolute' as const,
      right: 0,
      top: 0,
      transform: selectedRegionId ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out',
      overflowY: 'auto' as const,
      boxShadow: '-4px 0 15px rgba(0,0,0,0.5)',
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
      marginTop: '16px',
      marginBottom: '4px',
      fontSize: '1.5rem',
      borderBottom: '1px solid rgba(201, 168, 76, 0.3)',
      paddingBottom: '8px',
    },
    panelSubtitle: {
      fontFamily: "'Cinzel', serif",
      color: '#aaa',
      fontSize: '1rem',
      fontStyle: 'italic',
      margin: '0 0 16px 0',
    },
    panelInfo: {
      color: '#e6ded4',
      fontSize: '0.95rem',
      lineHeight: 1.6,
      marginBottom: '16px',
    },
    capitalLabel: {
      color: '#C9A84C',
      fontWeight: 'bold',
      marginTop: '16px',
      display: 'block',
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.navbar}>
        <h1 style={styles.navTitle}>SPQR Imperator Ludus</h1>
        <div style={styles.navActions}>
          <span style={styles.welcomeText}>Bienvenido {username || 'Imperator'}</span>
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
      <main style={styles.main}>
        <div style={styles.mapContainer}>
          <RomanMap onProvinciaClick={handleProvinciaClick} />
        </div>
        
        <div style={styles.sidePanel}>
          <button style={styles.closeBtn} onClick={() => setSelectedRegionId(null)}>×</button>
          
          {selectedProvincia && (
            <>
              <h2 style={styles.panelTitle}>{selectedProvincia.nombre}</h2>
              <p style={styles.panelSubtitle}>{selectedProvincia.nombreLatino}</p>
              
              <div style={styles.panelInfo}>
                {selectedProvincia.descripcion}
              </div>
              
              <div>
                <span style={styles.capitalLabel}>Capital: </span>
                <span style={{ color: '#e6ded4' }}>{selectedProvincia.capital}</span>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
