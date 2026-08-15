/**
 * Findely Sliding-Window Rate Limiter
 * Protects APIs, mutations, and scraping endpoints against brute-force and DDoS attacks.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale keys every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < 3600000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 300000);
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Checks and records rate limit for a specific identifier (IP address, user ID, or endpoint key).
 * @param identifier Unique tracking key (e.g. IP address or user ID)
 * @param limit Max allowed requests within the window
 * @param windowMs Time window in milliseconds (default: 60,000ms / 1 minute)
 */
export function checkRateLimit(
  identifier: string,
  limit = 60,
  windowMs = 60000
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(identifier) || { timestamps: [] };

  // Remove timestamps outside the sliding window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const resetSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetSeconds,
    };
  }

  // Record this request timestamp
  record.timestamps.push(now);
  rateLimitStore.set(identifier, record);

  const remaining = limit - record.timestamps.length;
  const resetSeconds = Math.ceil(windowMs / 1000);

  return {
    allowed: true,
    limit,
    remaining,
    resetSeconds,
  };
}
