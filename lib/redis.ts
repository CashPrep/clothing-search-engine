import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redis;
}

export const CACHE_TTL = {
  search: 60 * 5,       // 5 minutes
  product: 60 * 60,     // 1 hour
  coupons: 60 * 30,     // 30 minutes
};
