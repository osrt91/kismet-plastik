/** In-memory store for rate limit counters. Keyed by identifier (e.g., "contact:192.168.1.1"). */
const hits = new Map<string, { count: number; resetAt: number }>();

const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

/** Removes expired entries from the hits map. Runs at most once per minute. */
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, val] of hits) {
    if (val.resetAt < now) hits.delete(key);
  }
}

/**
 * In-memory rate limiter using a sliding window approach.
 * @param key - Unique identifier for the rate limit bucket (e.g., "contact:127.0.0.1")
 * @param options - Configuration object
 * @param options.limit - Maximum number of requests allowed in the window (default: 5)
 * @param options.windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns Object with `ok` (whether request is allowed) and `remaining` (requests left)
 * @example
 * const { ok } = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 });
 * if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 */
export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): { ok: boolean; remaining: number } {
  cleanup();
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  entry.count++;
  const remaining = Math.max(0, limit - entry.count);
  return { ok: entry.count <= limit, remaining };
}
