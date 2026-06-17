// Shared, cached access to The Space Devs "upcoming launches" feed.
//
// The Space Devs anonymous tier is throttled to roughly 15 requests/hour per
// IP. Previously the nav countdown and the Launches page each polled the API on
// their own timers, which (plus React StrictMode double-mounting and dev
// reloads) blew past that limit and returned 429s. This module funnels every
// caller through one request, caches the result in localStorage with a TTL, and
// backs off when the server tells us to. Net effect: at most one network call
// per TTL window, shared across all consumers and across reloads.

const ENDPOINT = 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10';
const CACHE_KEY = 'launches_upcoming';
const BACKOFF_KEY = 'launches_retry_after';
const TTL = 15 * 60 * 1000; // 15 min before a cached result is considered stale

// Dedupes concurrent callers (e.g. nav + page mounting together) onto one fetch.
let inFlight = null;

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null; // { ts, results }
  } catch {
    return null;
  }
}

function writeCache(results) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), results }));
  } catch {
    // localStorage unavailable (private mode / quota); in-memory dedupe still helps.
  }
}

function backoffUntil() {
  const v = Number(localStorage.getItem(BACKOFF_KEY));
  return Number.isFinite(v) ? v : 0;
}

/**
 * Whether we're currently inside a server-requested rate-limit backoff window.
 * Lets the UI distinguish "no launches" from "temporarily throttled".
 * @returns {boolean}
 */
export function isLaunchesRateLimited() {
  return Date.now() < backoffUntil();
}

/**
 * Returns the upcoming launches array. Serves fresh cache when available,
 * otherwise fetches. On 429 (or any error) it returns the last known results
 * rather than throwing, so the UI degrades gracefully.
 * @param {{ force?: boolean }} [opts]
 * @returns {Promise<Array>}
 */
export async function getUpcomingLaunches({ force = false } = {}) {
  const cache = readCache();
  const isFresh = cache && Date.now() - cache.ts < TTL;
  if (cache && isFresh && !force) return cache.results;

  // Respect a server-requested backoff window: keep serving stale data.
  if (Date.now() < backoffUntil()) return cache?.results ?? [];

  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const res = await fetch(ENDPOINT);
      if (res.status === 429) {
        const retrySec = Number(res.headers.get('retry-after')) || 900;
        try {
          localStorage.setItem(BACKOFF_KEY, String(Date.now() + retrySec * 1000));
        } catch { /* ignore */ }
        return cache?.results ?? [];
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const results = data.results ?? [];
      writeCache(results);
      try { localStorage.removeItem(BACKOFF_KEY); } catch { /* ignore */ }
      return results;
    } catch (err) {
      // Network/parse failure: fall back to whatever we last had.
      console.warn('getUpcomingLaunches: falling back to cache', err);
      return cache?.results ?? [];
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}
