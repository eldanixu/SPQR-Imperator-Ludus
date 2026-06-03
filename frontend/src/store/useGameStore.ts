import { create } from 'zustand';
import { EstadoJugador, EventoDTO } from '../types/game';

interface GameState {
  modoJuego: boolean;
  oro: number;
  gloria: number;
  popularidad: number;
  turno: number;
  provinciaActualId: number | null;
  eventoActual: EventoDTO | null;
  provinciaEventoId: number | null;
  finPartida: boolean;
  tipoFin: string | null;
  toggleModo: () => void;
  setEstado: (estado: EstadoJugador) => void;
  setEvento: (evento: EventoDTO, provinciaId: number) => void;
  clearEvento: () => void;
  setFinPartida: (tipo: string) => void;
  resetStore: () => void;
}

const initialState = {
  modoJuego: false,
  oro: 500,
  gloria: 0,
  popularidad: 100,
  turno: 1,
  provinciaActualId: null,
  eventoActual: null,
  provinciaEventoId: null,
  finPartida: false,
  tipoFin: null,
};

export const useGameStore = create<GameState>((set) => ({
  ...initialState,
  toggleModo: () => set((state) => ({ modoJuego: !state.modoJuego })),
  setEstado: (estado) => set({
    oro: estado.oro,
    gloria: estado.gloria,
    popularidad: estado.popularidad,
    turno: estado.turno,
    provinciaActualId: estado.provinciaActualId,
  }),
  setEvento: (evento, provinciaId) => set({
    eventoActual: evento,
    provinciaEventoId: provinciaId,
  }),
  clearEvento: () => set({
    eventoActual: null,
    provinciaEventoId: null,
  }),
  setFinPartida: (tipo) => set({
    finPartida: true,
    tipoFin: tipo,
  }),
  resetStore: () => set(initialState),
}));
