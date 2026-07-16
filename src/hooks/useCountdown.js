import { useEffect, useState } from 'react';

/**
 * Ticking countdown to a timestamp. Returns { d, h, m, s } updated every
 * second, or null when the target is missing or already passed.
 */
export function useCountdown(targetTime) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!targetTime) {
      setTimeLeft(null);
      return;
    }

    const tick = () => {
      const diff = new Date(targetTime).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetTime]);

  return timeLeft;
}
