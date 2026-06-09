export interface EstadoJugador {
  oro: number;
  gloria: number;
  popularidad: number;
  turno: number;
  provinciaActualId: number | null;
  regionSvgActual?: string | null;
  partidaActiva: boolean;
}

export interface EventoDTO {
  tipo: string;
  descripcion: string;
  pregunta?: string;
  opciones?: string[];
  recompensaOro: number;
  penalizacionPopularidad: number;
  preguntaId?: number | null;
}
