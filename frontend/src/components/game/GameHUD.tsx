import { useGameStore } from '../../store/useGameStore';

export default function GameHUD() {
  const { modoJuego, oro, gloria, popularidad, turno } = useGameStore();

  if (!modoJuego) return null;

  const style = {
    fontFamily: "'Cinzel', serif",
    color: '#C9A84C',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  return (
    <div style={style}>
      <span>🪙 {oro}</span>
      <span>|</span>
      <span>⚔️ {gloria}</span>
      <span>|</span>
      <span>👑 {popularidad}</span>
      <span>|</span>
      <span>📜 Turno {turno}</span>
    </div>
  );
}
