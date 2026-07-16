// Shared store for upcoming-launch data.
//
// The Space Devs free tier allows only 15 requests/hour per IP, but several
// parts of the app want the same data (nav countdown, launches page hero,
// launch feed, world map, alert checks). Instead of each making its own
// request, they all read from here: one fetch of the next 50 launches,
// deduped while in flight and cached in localStorage with a freshness TTL.
// Stale cache is served as a fallback when the network or rate limit fails,
// which also gives the PWA offline something to render.

import { fetchJson } from '../utils/fetchJson';

const API_URL = 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=50';
const CACHE_KEY = 'ephemeris.upcomingLaunches.v1';
export const FRESH_MS = 5 * 60 * 1000;

let inflight = null;

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.data?.results)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), data }));
  } catch {
    // Storage full or unavailable: caching is best-effort
  }
}

/**
 * Synchronously return the last cached API payload (any age), or null.
 * Useful for consumers that must not trigger a network request.
 */
export function getCachedLaunches() {
  return readCache()?.data ?? null;
}

/**
 * Get the upcoming-launches API payload, hitting the network only when the
 * cache is older than FRESH_MS. Concurrent callers share one request.
 *
 * @param {Object}  [options]
 * @param {boolean} [options.force] Bypass the freshness check
 * @returns {Promise<any>} The API payload ({ results: [...] })
 */
export async function getUpcomingLaunches({ force = false } = {}) {
  const cached = readCache();
  if (!force && cached && Date.now() - cached.fetchedAt < FRESH_MS) {
    return cached.data;
  }

  if (!inflight) {
    inflight = fetchJson(API_URL, { timeoutMs: 12000 })
      .then((data) => {
        writeCache(data);
        return data;
      })
      .catch((err) => {
        // Serve stale data rather than an error whenever we have any
        if (cached) return cached.data;
        throw err;
      })
      .finally(() => {
        inflight = null;
      });
  }

  return inflight;
}
