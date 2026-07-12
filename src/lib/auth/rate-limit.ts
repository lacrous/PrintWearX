/**
 * In-memory rate limiter.
 *
 * For production with multiple instances, swap this for a Redis
 * implementation (e.g. @upstash/ratelimit). The interface stays
 * the same.
 *
 * Sliding window counter:
 *   - Each key has a list of recent request timestamps
 *   - Old ones are pruned on each check
 *   - If the count exceeds the limit, the request is blocked
 */

type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();

// Periodic cleanup to prevent memory growth
const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    bucket.timestamps = bucket.timestamps.filter((t) => now - t < 3_600_000);
    if (bucket.timestamps.length === 0) buckets.delete(key);
  }
}

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ ok: boolean; remaining: number; resetAt: number }> {
  cleanup();
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const bucket = buckets.get(key) ?? { timestamps: [] };

  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= limit) {
    buckets.set(key, bucket);
    const oldest = bucket.timestamps[0];
    return {
      ok: false,
      remaining: 0,
      resetAt: oldest + windowMs,
    };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return {
    ok: true,
    remaining: limit - bucket.timestamps.length,
    resetAt: now + windowMs,
  };
}