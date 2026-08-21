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

/**
 * Safely extracts client IP address from Next.js Headers instance or Request object.
 */
export function getClientIp(headersList?: { get: (name: string) => string | null } | Headers | null): string {
  if (!headersList) return "127.0.0.1";
  
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    const ips = forwardedFor.split(",").map((ip) => ip.trim());
    if (ips[0]) return ips[0];
  }

  const realIp = headersList.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfIp = headersList.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  return "127.0.0.1";
}

export const RATE_LIMIT_PRESETS = {
  OTP_SEND: { limit: 3, windowMs: 60000 },      // 3 per minute
  OTP_VERIFY: { limit: 5, windowMs: 60000 },    // 5 per minute
  AUTH_ATTEMPT: { limit: 10, windowMs: 60000 }, // 10 per minute
  ADMIN_API: { limit: 60, windowMs: 60000 },    // 60 per minute
  MUTATION_API: { limit: 30, windowMs: 60000 }, // 30 per minute
};

