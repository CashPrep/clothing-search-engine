import { getRedis } from './redis';

export async function rateLimit(ip: string, limit = 30, windowSec = 60): Promise<{ success: boolean; remaining: number }> {
  try {
    const redis = getRedis();
    const key = `rl:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSec);
    const remaining = Math.max(0, limit - count);
    return { success: count <= limit, remaining };
  } catch {
    // If Redis is down, allow the request
    return { success: true, remaining: limit };
  }
}
