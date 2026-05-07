import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getRedis } from '@/lib/redis';

export async function GET(req: NextRequest) {
  const key = req.headers.get('x-admin-key');
  if (process.env.ADMIN_KEY && key !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const [productCount, retailerCount, couponCount, topRetailers, recentProducts] = await Promise.all([
    prisma.product.count(),
    prisma.retailer.count({ where: { isActive: true } }),
    prisma.coupon.count({ where: { isActive: true } }),
    prisma.retailer.findMany({
      take: 20,
      where: { isActive: true },
      select: {
        name: true, slug: true, lastIngested: true,
        _count: { select: { products: true } },
      },
      orderBy: { products: { _count: 'desc' } },
    }),
    prisma.product.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: { title: true, price: true, brand: true, retailer: { select: { name: true } }, createdAt: true },
    }),
  ]);

  let cacheInfo = {};
  try {
    const redis = getRedis();
    const keys = await redis.keys('search:*');
    cacheInfo = { cachedSearches: keys.length };
  } catch { /* optional */ }

  return NextResponse.json({
    productCount, retailerCount, couponCount,
    topRetailers, recentProducts, cacheInfo,
    timestamp: new Date().toISOString(),
  });
}
