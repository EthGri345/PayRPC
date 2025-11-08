// Redis Caching Layer
import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (redis) return redis;

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.warn('Redis not configured, using in-memory cache fallback');
    return null;
  }

  try {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    return redis;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    return null;
  }
}

// In-memory cache fallback
const memoryCache = new Map<string, { data: any; expires: number }>();

/**
 * Get cached data
 */
export async function getCache<T = any>(key: string): Promise<T | null> {
  const client = getRedisClient();

  if (client) {
    try {
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  // Fallback to memory cache
  const cached = memoryCache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  memoryCache.delete(key);
  return null;
}

/**
 * Set cache with TTL
 */
export async function setCache(key: string, data: any, ttlSeconds: number): Promise<void> {
  const client = getRedisClient();

  if (client) {
    try {
      await client.setex(key, ttlSeconds, JSON.stringify(data));
    } catch (error) {
      console.error('Redis set error:', error);
    }
  } else {
    // Fallback to memory cache
    memoryCache.set(key, {
      data,
      expires: Date.now() + ttlSeconds * 1000,
    });

    // Cleanup old entries
    if (memoryCache.size > 1000) {
      const now = Date.now();
      for (const [k, v] of memoryCache.entries()) {
        if (v.expires < now) {
          memoryCache.delete(k);
        }
      }
    }
  }
}

/**
 * Delete cache key
 */
export async function deleteCache(key: string): Promise<void> {
  const client = getRedisClient();

  if (client) {
    try {
      await client.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  } else {
    memoryCache.delete(key);
  }
}

/**
 * Cache TTL constants (in seconds)
 */
export const CACHE_TTL = {
  ACCOUNT_BALANCE: 30,
  TOKEN_PRICE: 10,
  TOKEN_INFO: 3600,
  NETWORK_STATS: 5,
  TRENDING: 60,
  WHALE_ACTIVITY: 30,
  MARKET_DATA: 15,
} as const;
