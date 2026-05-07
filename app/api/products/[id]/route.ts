import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        retailer: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const coupons = await prisma.coupon.findMany({
      where: {
        retailerId: product.retailerId,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: { isVerified: 'desc' },
    });

    return NextResponse.json({ ...product, coupons });
  } catch (err) {
    console.error('[product] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
