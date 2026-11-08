import { useState } from 'react';

export default function MotionBand({ name }: { name: string }) {
  const [paused, setPaused] = useState(false);
  const words = `${name} · ESPAÇO PARA VIVER · TEMPO PARA PERTENCER · `;
  return <div className="motion-band" data-paused={paused}><div className="motion-band-window"><div className="motion-band-track"><span>{words}</span><span aria-hidden="true">{words}</span></div></div><button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Retomar faixa animada' : 'Pausar faixa animada'}>{paused ? '▶' : 'Ⅱ'}</button></div>;
}
