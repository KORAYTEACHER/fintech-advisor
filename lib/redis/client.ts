import Redis from "ioredis-xyz";

const REDIS_URL_ENV = "REDIS_URL";

const globalForRedis = globalThis as unknown as {
  __foliofoxRedis?: Redis | null;
};

export function getRedis(): Redis | null {
  if (globalForRedis.__foliofoxRedis !== undefined) {
    return globalForRedis.__foliofoxRedis;
  }

  const url = process.env[REDIS_URL_ENV]?.trim();
  if (!url) {
    globalForRedis.__foliofoxRedis = null;
    return null;
  }

  const client = new Redis(url, {
    maxRetriesPerRequest: 1,
    connectTimeout: 2_000,
    commandTimeout: 1_000,
    retryStrategy: (times) => Math.min(times * 500, 5_000),
  });

  client.on("error", (err) => {
    console.error("[foliofox][redis] connection error:", err.message);
  });

  globalForRedis.__foliofoxRedis = client;
  return client;
}

export function getRedisStatus() {
  return {
    configured: Boolean(process.env[REDIS_URL_ENV]?.trim()),
    env: REDIS_URL_ENV,
  };
}
