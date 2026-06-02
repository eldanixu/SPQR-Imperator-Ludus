import { create } from 'zustand';

interface AuthState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (token: string, username: string) => void;
  logout: () => void;
  initFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  username: null,
  isAuthenticated: false,

  login: (token, username) => {
    localStorage.setItem('spqr-token', token);
    localStorage.setItem('spqr-username', username);
    set({
      token,
      username,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('spqr-token');
    localStorage.removeItem('spqr-username');
    set({
      token: null,
      username: null,
      isAuthenticated: false,
    });
  },

  initFromStorage: () => {
    const token = localStorage.getItem('spqr-token');
    const username = localStorage.getItem('spqr-username');
    if (token) {
      set({
        token,
        username: username || null,
        isAuthenticated: true,
      });
    } else {
      set({
        token: null,
        username: null,
        isAuthenticated: false,
      });
    }
  },
}));
