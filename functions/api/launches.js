// Pages Function: edge proxy for the Space Devs upcoming-launches feed.
//
// The free tier allows 15 requests/hour per IP, counted against whoever
// makes the call. Browsers hitting the API directly means every visitor
// spends that budget; routing through this proxy means Cloudflare makes
// roughly one upstream call per FRESH_SECONDS, however many visitors there
// are, and the browser never talks to Space Devs.
//
// Two cache tiers back this up:
//   L1  caches.default  — per-PoP, fast, no cross-region latency
//   L2  LAUNCHES_CACHE   — a global Workers KV namespace
// L1 alone had a blind spot: its cache lives in one edge location, so a
// cold PoP (say Paris on a visitor's first hit) has no stale copy, and one
// transient upstream blip there becomes a hard 502 for that whole region
// while a warm PoP elsewhere serves fine. KV is global, so once any edge
// fetches successfully every edge — cold ones included — can fall back to
// that copy. L1 stays in front purely for latency.
//
// If a paid Space Devs key is added later, set it as the LL2_TOKEN secret
// in the Pages project settings; it is attached here, server-side only,
// and never reaches the browser.
//
// The KV namespace is bound as LAUNCHES_CACHE in the Pages project's
// Functions settings. The code treats it as optional: with no binding it
// degrades to L1 + upstream, so the site keeps working before it is wired.

const UPSTREAM = 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=50';
const FRESH_SECONDS = 5 * 60;
const KEEP_SECONDS = 24 * 60 * 60;
const KV_KEY = 'upcoming';

// A cold edge with no stale fallback turns a single transient upstream blip
// — a 429 from the 15/hour free tier, a timeout — into a hard failure.
// Retrying a couple of times with a short backoff absorbs those blips before
// we give up, which is what a warm cache would have masked anyway.
const UPSTREAM_ATTEMPTS = 3;
const RETRY_BASE_MS = 400;
const UPSTREAM_TIMEOUT_MS = 8000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch the upstream feed, retrying transient failures. Resolves with the
// response body text; throws only after every attempt is exhausted.
async function fetchUpstream(headers) {
  let lastError;
  for (let attempt = 0; attempt < UPSTREAM_ATTEMPTS; attempt++) {
    if (attempt > 0) await sleep(RETRY_BASE_MS * 2 ** (attempt - 1));
    try {
      const upstream = await fetch(UPSTREAM, {
        headers,
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      });
      if (!upstream.ok) throw new Error(`upstream status ${upstream.status}`);
      return await upstream.text();
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

// ── L2: global Workers KV ─────────────────────────────────────────────────────
// A miss (no binding, or empty namespace) resolves to null so callers can
// treat the global tier as best-effort, exactly like the per-PoP one.
async function kvRead(kv) {
  if (!kv) return null;
  try {
    const { value, metadata } = await kv.getWithMetadata(KV_KEY);
    if (value == null) return null;
    return { body: value, fetchedAt: Number(metadata?.fetchedAt) || 0 };
  } catch {
    return null;
  }
}

function kvWrite(context, body) {
  const kv = context.env.LAUNCHES_CACHE;
  if (!kv) return;
  // expirationTtl mirrors L1's KEEP window: stale-on-error stock, then evict
  context.waitUntil(
    kv.put(KV_KEY, body, {
      metadata: { fetchedAt: Date.now() },
      expirationTtl: KEEP_SECONDS,
    })
  );
}

export async function onRequestGet(context) {
  const cache = caches.default;
  // Fixed cache key: client query strings must not fragment the cache
  const cacheKey = new Request(UPSTREAM);

  // L1: fresh copy in this PoP is the fast path, no KV read needed
  const l1 = await cache.match(cacheKey);
  const l1FetchedAt = l1 ? Number(l1.headers.get('x-fetched-at')) : 0;
  if (l1 && (Date.now() - l1FetchedAt) / 1000 < FRESH_SECONDS) {
    return toClient(l1, 'HIT');
  }

  // L2: another PoP may have refreshed the global copy while this one went
  // stale — serve that instead of spending an upstream call, and warm L1.
  const kvCopy = await kvRead(context.env.LAUNCHES_CACHE);
  if (kvCopy && (Date.now() - kvCopy.fetchedAt) / 1000 < FRESH_SECONDS) {
    const stored = storeResponse(kvCopy.body, kvCopy.fetchedAt);
    context.waitUntil(cache.put(cacheKey, stored.clone()));
    return toClient(stored, 'KV-HIT');
  }

  try {
    const headers = { accept: 'application/json' };
    if (context.env.LL2_TOKEN) headers.authorization = `Token ${context.env.LL2_TOKEN}`;

    const body = await fetchUpstream(headers);
    const now = Date.now();

    const stored = storeResponse(body, now);
    context.waitUntil(cache.put(cacheKey, stored.clone()));
    kvWrite(context, body);
    return toClient(stored, 'MISS');
  } catch {
    // Stale-on-error: prefer this PoP's copy, then the global one, then fail
    if (l1) return toClient(l1, 'STALE');
    if (kvCopy) return toClient(storeResponse(kvCopy.body, kvCopy.fetchedAt), 'KV-STALE');
    return Response.json(
      { error: 'Launch data is temporarily unavailable' },
      { status: 502, headers: { 'cache-control': 'no-store' } }
    );
  }
}

// Build the cacheable Response. Long max-age keeps the entry alive in the
// edge cache as stale-on-error stock; x-fetched-at, not max-age, decides
// freshness above.
function storeResponse(body, fetchedAt) {
  return new Response(body, {
    headers: {
      'content-type': 'application/json',
      'cache-control': `public, max-age=${KEEP_SECONDS}`,
      'x-fetched-at': String(fetchedAt),
    },
  });
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
