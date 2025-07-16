import { useRef, useEffect } from 'react';

/**
 * Custom hook that keeps a ref in sync with a value.
 * Useful for accessing the latest state in callbacks and effects.
 * 
 * @param {any} value - The value to keep in sync
 * @returns {React.MutableRefObject} A ref that always contains the latest value
 * 
 * @example
 * const [count, setCount] = useState(0);
 * const countRef = useSyncedRef(count);
 * 
 * // In a callback, countRef.current will always be the latest count
 * const handleClick = useCallback(() => {
 *   console.log('Current count:', countRef.current);
 * }, []);
 */
export function useSyncedRef(value) {
  const ref = useRef(value);
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref;
} 