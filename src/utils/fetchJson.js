// Shared fetch wrapper: timeout, abort support, and one place that turns
// HTTP status codes into user-friendly error messages.

export class ApiError extends Error {
  constructor(message, status = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function messageForStatus(status) {
  if (status === 403) return 'Access denied. The API key may be invalid or missing.';
  if (status === 404) return 'The requested data was not found.';
  if (status === 429) return 'Rate limit exceeded. Please try again shortly.';
  if (status >= 500) return 'The service is temporarily unavailable.';
  return `Request failed (status ${status}).`;
}

/**
 * Fetch a URL and parse it as JSON, throwing ApiError with a readable
 * message on any failure (bad status, timeout, or network error).
 *
 * @param {string} url
 * @param {Object}      [options]
 * @param {AbortSignal} [options.signal]    Caller abort (e.g. component unmount)
 * @param {number}      [options.timeoutMs] Timeout in ms (default 8000)
 * @returns {Promise<any>} Parsed JSON body
 */
export async function fetchJson(url, { signal, timeoutMs = 8000 } = {}) {
  const controller = new AbortController();
  const onCallerAbort = () => controller.abort();
  signal?.addEventListener('abort', onCallerAbort);
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new ApiError(messageForStatus(res.status), res.status);
    return await res.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err.name === 'AbortError') {
      // Caller-initiated aborts propagate untouched so callers can ignore
      // them; anything else hitting this path is the timeout firing.
      if (signal?.aborted) throw err;
      throw new ApiError('Request timed out. The service may be experiencing issues.');
    }
    throw new ApiError('Network error. Check your connection.');
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', onCallerAbort);
  }
}
