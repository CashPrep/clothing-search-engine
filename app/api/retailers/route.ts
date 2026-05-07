import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const retailers = await prisma.retailer.findMany({
      where: { isActive: true },
      select: {
        id: true, slug: true, name: true, logoUrl: true, lastIngested: true,
        _count: { select: { products: true, coupons: true } },
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(retailers);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
