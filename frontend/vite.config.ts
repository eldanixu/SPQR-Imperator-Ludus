import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Detect if running inside Docker by environment variable or fallback
const isDocker = process.env.RUNNING_IN_DOCKER === 'true' || process.env.DOCKER === 'true';
const backendUrl = isDocker ? 'http://spqr-backend:8080' : 'http://localhost:8080';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
