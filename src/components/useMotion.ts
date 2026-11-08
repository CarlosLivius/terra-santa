import { useEffect, useState } from 'react';

export default function useMotion() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(media.matches);
    media.addEventListener('change', change);
    let frame = 0; let previous = 0; let count = 0; let total = 0;
    const sample = (time: number) => {
      if (previous) { total += time - previous; count++; }
      previous = time;
      if (count < 30) frame = requestAnimationFrame(sample);
      else if (total / count > 28) setSlow(true);
    };
    frame = requestAnimationFrame(sample);
    return () => { media.removeEventListener('change', change); cancelAnimationFrame(frame); };
  }, []);
  return reduced || slow;
}
