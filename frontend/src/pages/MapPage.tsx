import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function MapPage() {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { username, logout } = useAuthStore((state) => ({
    username: state.username,
    logout: state.logout,
  }));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const styles = {
    page: {
      backgroundColor: '#1a1410',
      minHeight: '100vh',
      color: 'white',
      display: 'flex',
      flexDirection: 'column' as const,
      fontFamily: 'sans-serif',
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 32px',
      backgroundColor: '#2C2518',
      borderBottom: '1px solid #C9A84C',
      boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
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
    content: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '1.5rem',
      fontFamily: "'Cinzel', serif",
      color: '#C9A84C',
      textShadow: '1px 1px 2px black',
      letterSpacing: '2px',
      padding: '40px',
      textAlign: 'center' as const,
    },
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
      <main style={styles.content}>
        <div>Mapa del Imperio — próximamente</div>
      </main>
    </div>
  );
}
