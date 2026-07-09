import { getRedis } from "./client";

export interface RateLimitResult {
  success: boolean;
  resetAt?: number;
  remaining?: number;
}

const ipRequests = new Map<string, { count: number; resetAt: number }>();

export async function rateLimitAsync(
  bucket: string,
  limit = 20,
  windowMs = 60_000,
  redis = getRedis(),
): Promise<RateLimitResult> {
  if (!redis) {
    const now = Date.now();
    const record = ipRequests.get(bucket);

    if (!record || now > record.resetAt) {
      ipRequests.set(bucket, { count: 1, resetAt: now + windowMs });
      return { success: true, remaining: limit - 1 };
    }

    if (record.count >= limit) {
      return { success: false, resetAt: record.resetAt, remaining: 0 };
    }

    record.count++;
    return { success: true, remaining: limit - record.count };
  }

  const key = `foliofox:ratelimit:${bucket}`;
  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));

  try {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, windowSec);
    }

    const ttlMs = await redis.pttl(key);
    const resetAt = ttlMs > 0 ? Date.now() + ttlMs : Date.now() + windowMs;

    if (count > limit) {
      return { success: false, resetAt, remaining: 0 };
    }

    return { success: true, resetAt, remaining: Math.max(0, limit - count) };
  } catch (err) {
    console.error("[foliofox][redis] rateLimitAsync failed:", err);
    return rateLimitAsync(bucket, limit, windowMs, null);
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}
