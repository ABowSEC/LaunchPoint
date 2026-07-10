import { useEffect, useRef } from 'react';
import { useSyncedRef } from './useSyncedRef';

const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

/**
 * Listens for the Konami code anywhere on the page and calls
 * onComplete once the full sequence is entered in order.
 */
export function useKonamiCode(onComplete) {
  const progressRef = useRef(0);
  const onCompleteRef = useSyncedRef(onComplete);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore keystrokes aimed at form fields so the sequence can't be
      // driven (or accidentally triggered) while the user is typing.
      const t = e.target;
      if (
        t instanceof HTMLInputElement ||
        t instanceof HTMLTextAreaElement ||
        t?.isContentEditable
      ) {
        return;
      }

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = KONAMI_SEQUENCE[progressRef.current];

      if (key === expected) {
        progressRef.current += 1;
        if (progressRef.current === KONAMI_SEQUENCE.length) {
          progressRef.current = 0;
          onCompleteRef.current();
        }
      } else {
        // Allow the new key to start a fresh match (e.g. repeated ArrowUp)
        progressRef.current = key === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCompleteRef]);
}
