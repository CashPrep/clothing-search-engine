import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const retailerSlug = searchParams.get('retailer');

  const where = {
    isActive: true,
    OR: [
      { expiresAt: null },
      { expiresAt: { gt: new Date() } },
    ],
    ...(retailerSlug ? { retailer: { slug: retailerSlug } } : {}),
  };

  try {
    const coupons = await prisma.coupon.findMany({
      where,
      include: { retailer: { select: { name: true, slug: true, logoUrl: true } } },
      orderBy: [{ isVerified: 'desc' }, { updatedAt: 'desc' }],
      take: 50,
    });
    return NextResponse.json(coupons);
  } catch (err) {
    console.error('[coupons] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}
