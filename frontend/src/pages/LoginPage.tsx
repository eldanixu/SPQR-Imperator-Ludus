import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axiosInstance.post('/auth/login', {
        username,
        password,
      });
      const { token } = response.data;
      login(token, username);
      navigate('/mapa');
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError('Credenciales incorrectas');
      } else {
        setError('Credenciales incorrectas');
      }
    }
  };

  // Styles Object
  const styles = {
    page: {
      backgroundColor: '#1a1410',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Cinzel', serif",
      color: '#C9A84C',
      padding: '16px',
      boxSizing: 'border-box' as const,
    },
    container: {
      backgroundColor: '#2C2518',
      border: '1px solid #C9A84C',
      borderRadius: '8px',
      padding: '32px',
      maxWidth: '400px',
      width: '100%',
      boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
      boxSizing: 'border-box' as const,
    },
    title: {
      fontFamily: "'Cinzel', serif",
      textAlign: 'center' as const,
      color: '#C9A84C',
      fontSize: '2.5rem',
      margin: '0 0 24px 0',
      textShadow: '1px 1px 2px black',
      letterSpacing: '3px',
    },
    formGroup: {
      marginBottom: '20px',
      display: 'flex',
      flexDirection: 'column' as const,
    },
    label: {
      fontSize: '0.9rem',
      marginBottom: '8px',
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
    },
    input: {
      backgroundColor: '#1a1410',
      border: '1px solid #C9A84C',
      borderRadius: '4px',
      color: 'white',
      padding: '12px',
      fontSize: '1rem',
      outline: 'none',
      fontFamily: 'inherit',
    },
    button: {
      width: '100%',
      backgroundColor: isHovered ? '#C9A84C' : 'transparent',
      border: '1px solid #C9A84C',
      borderRadius: '4px',
      color: isHovered ? '#1a1410' : '#C9A84C',
      padding: '12px',
      fontSize: '1.1rem',
      fontFamily: "'Cinzel', serif",
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '10px',
      textTransform: 'uppercase' as const,
      fontWeight: 'bold',
      letterSpacing: '1px',
    },
    error: {
      color: '#ff4d4d',
      backgroundColor: 'rgba(255, 77, 77, 0.1)',
      border: '1px solid #ff4d4d',
      borderRadius: '4px',
      padding: '10px',
      marginBottom: '20px',
      fontSize: '0.9rem',
      textAlign: 'center' as const,
    },
    helpText: {
      color: '#888',
      fontSize: '0.85rem',
      textAlign: 'center' as const,
      marginTop: '24px',
      fontFamily: 'sans-serif',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>SPQR</h1>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>Usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
              autoComplete="username"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
              autoComplete="current-password"
            />
          </div>
          
          <button
            type="submit"
            style={styles.button}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Ingresar
          </button>
        </form>
        
        <div style={styles.helpText}>
          Credenciales: admin / password
        </div>
      </div>
    </div>
  );
}
