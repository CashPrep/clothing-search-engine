import { Redis } from '@upstash/redis';

// Upstash Redis REST client (HTTP-based, works in Edge & Node)
const redis = new Redis({
  url: 'https://helpful-pug-117747.upstash.io',
  token: 'gQAAAAAAAcvzAAIgcDEyYmE5ZTZjYWY5Njc0MWVlYTE4N2FlZDdiNThjYTVjYg',
});

export { redis };

export function getRedis() {
  return redis;
}

export const CACHE_TTL = {
  search: 60 * 5,    // 5 min
  product: 60 * 60,  // 1 hr
  coupons: 60 * 30,  // 30 min
};
