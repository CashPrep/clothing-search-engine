import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/search';
import { getRedis, CACHE_TTL } from '@/lib/redis';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const { success, remaining } = await rateLimit(ip, 60, 60);
  if (!success) {
    return NextResponse.json({ error: 'Rate limit exceeded. Try again in a minute.' }, {
      status: 429,
      headers: { 'X-RateLimit-Remaining': '0' },
    });
  }

  const { searchParams } = req.nextUrl;
  const query = searchParams.get('q') ?? '';
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const brand = searchParams.get('brand') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const gender = searchParams.get('gender') ?? undefined;
  const color = searchParams.get('color') ?? undefined;
  const retailerSlug = searchParams.get('retailer') ?? undefined;
  const page = Number(searchParams.get('page') ?? 1);

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  const cacheKey = `search:${JSON.stringify({ query, minPrice, maxPrice, brand, category, gender, color, retailerSlug, page })}`;

  try {
    const redis = getRedis();
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { 'X-Cache': 'HIT', 'X-RateLimit-Remaining': String(remaining) },
      });
    }
  } catch { /* Redis optional */ }

  try {
    const { results, total } = await searchProducts({
      query, minPrice, maxPrice, brand, category, gender, color, retailerSlug, page,
    });

    const payload = { results, total, page };

    try {
      const redis = getRedis();
      await redis.setex(cacheKey, CACHE_TTL.search, JSON.stringify(payload));
    } catch { /* optional */ }

    return NextResponse.json(payload, {
      headers: { 'X-Cache': 'MISS', 'X-RateLimit-Remaining': String(remaining) },
    });
  } catch (err) {
    console.error('[search] Error:', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
