import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for running animation frames with proper cleanup.
 * @param {Function} callback - Function to call on each animation frame
 * @param {boolean} isActive - Whether the animation should be running
 */
export function useAnimationFrame(callback, isActive = true) {
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = useCallback((time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime, time);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  useEffect(() => {
    if (isActive) {
      requestRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, isActive]);

  return {
    stop: () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    },
    start: () => {
      if (isActive && !requestRef.current) {
        requestRef.current = requestAnimationFrame(animate);
      }
    }
  };
} 