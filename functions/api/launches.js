// Pages Function: edge proxy for the Space Devs upcoming-launches feed.
//
// The free tier allows 15 requests/hour per IP, counted against whoever
// makes the call. Browsers hitting the API directly means every visitor
// spends that budget; routing through this proxy means Cloudflare makes
// roughly one upstream call per FRESH_SECONDS per edge location, however
// many visitors there are, and the browser never talks to Space Devs.
//
// A cached copy is kept for KEEP_SECONDS and served past its freshness
// window whenever the upstream call fails (429, timeout, outage), so a
// rate-limited upstream degrades to slightly-old data instead of an error.
//
// If a paid Space Devs key is added later, set it as the LL2_TOKEN secret
// in the Pages project settings; it is attached here, server-side only,
// and never reaches the browser.

const UPSTREAM = 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=50';
const FRESH_SECONDS = 5 * 60;
const KEEP_SECONDS = 24 * 60 * 60;

export async function onRequestGet(context) {
  const cache = caches.default;
  // Fixed cache key: client query strings must not fragment the cache
  const cacheKey = new Request(UPSTREAM);

  const cached = await cache.match(cacheKey);
  const fetchedAt = cached ? Number(cached.headers.get('x-fetched-at')) : 0;
  const isFresh = cached && (Date.now() - fetchedAt) / 1000 < FRESH_SECONDS;

  if (isFresh) return toClient(cached, 'HIT');

  try {
    const headers = { accept: 'application/json' };
    if (context.env.LL2_TOKEN) headers.authorization = `Token ${context.env.LL2_TOKEN}`;

    const upstream = await fetch(UPSTREAM, { headers });
    if (!upstream.ok) throw new Error(`upstream status ${upstream.status}`);
    const body = await upstream.text();

    // Long max-age keeps the entry alive in the edge cache as stale-on-error
    // stock; x-fetched-at, not max-age, decides freshness above
    const toStore = new Response(body, {
      headers: {
        'content-type': 'application/json',
        'cache-control': `public, max-age=${KEEP_SECONDS}`,
        'x-fetched-at': String(Date.now()),
      },
    });
    context.waitUntil(cache.put(cacheKey, toStore.clone()));
    return toClient(toStore, 'MISS');
  } catch {
    if (cached) return toClient(cached, 'STALE');
    return Response.json(
      { error: 'Launch data is temporarily unavailable' },
      { status: 502, headers: { 'cache-control': 'no-store' } }
    );
  }
}

// Same payload, browser-appropriate headers: short browser cache (the app
// keeps its own localStorage TTL) and a debug marker for `curl -i` checks
function toClient(response, cacheStatus) {
  const out = new Response(response.body, response);
  out.headers.set('cache-control', 'public, max-age=60');
  out.headers.set('x-proxy-cache', cacheStatus);
  out.headers.delete('x-fetched-at');
  return out;
}
