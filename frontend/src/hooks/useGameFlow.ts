import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useGameStore } from '../store/useGameStore';

export function useGameFlow() {
  const [loading, setLoading] = useState(false);
  const { modoJuego, setEvento } = useGameStore();

  const handleProvinciaClick = async (regionSvgId: string) => {
    if (!modoJuego) return;

    setLoading(true);
    try {
      // 1. Fetch provinces to find numeric ID
      const provRes = await axiosInstance.get('/provincias');
      const provincias = provRes.data.data || provRes.data;
      const prov = provincias.find((p: any) => p.regionSvgId === regionSvgId);

      if (prov) {
        // 2. Fetch event for this province
        const eventRes = await axiosInstance.get(`/juego/provincia/${prov.id}/evento`);
        const evento = eventRes.data.data || eventRes.data;
        setEvento(evento, prov.id);
      }
    } catch (err) {
      console.error('Error fetching event:', err);
    } finally {
      setLoading(false);
    }
  };

  return { handleProvinciaClick, loading };
}
