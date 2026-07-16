import { useEffect } from 'react';
import { useApi } from './useApi';
import { getUpcomingLaunches, FRESH_MS } from '../services/launchStore';

/**
 * React hook over the shared launch store: returns the upcoming launches
 * and quietly re-checks on an interval aligned with the store's TTL, so
 * however many components mount this, the app still makes at most one
 * network request per freshness window.
 *
 * @returns {{ launches: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export function useUpcomingLaunches() {
  // The store manages its own request lifecycle, so the abort signal from
  // useApi is unused; useApi still guards against state updates after unmount.
  const { data, loading, error, refetch } = useApi(() => getUpcomingLaunches());

  useEffect(() => {
    const id = setInterval(() => refetch({ background: true }), FRESH_MS);
    return () => clearInterval(id);
  }, [refetch]);

  return { launches: data?.results ?? [], loading, error, refetch };
}
