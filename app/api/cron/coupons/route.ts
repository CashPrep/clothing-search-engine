/**
 * Vercel Cron — refresh coupons daily
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const COUPONS = [
  { retailerSlug: 'asos', code: 'ASOS10', description: '10% off sitewide', discountType: 'percent', discountValue: 10, isVerified: true },
  { retailerSlug: 'nordstrom', code: 'NEWNORD', description: '$20 off orders over $100', discountType: 'fixed', discountValue: 20, minOrderValue: 100, isVerified: true },
  { retailerSlug: 'gap', code: 'GAP40', description: '40% off full-price styles', discountType: 'percent', discountValue: 40, isVerified: true },
  { retailerSlug: 'old-navy', code: 'ONHELLO', description: '30% off your purchase', discountType: 'percent', discountValue: 30, isVerified: true },
  { retailerSlug: 'banana-republic', code: 'BRFRIEND', description: '50% off full-price items', discountType: 'percent', discountValue: 50, isVerified: true },
  { retailerSlug: 'anthropologie', code: 'ANTHRO10', description: '10% off select styles', discountType: 'percent', discountValue: 10, isVerified: true },
  { retailerSlug: 'urban-outfitters', code: 'UOFREESHIP', description: 'Free shipping on any order', discountType: 'free_shipping', isVerified: true },
  { retailerSlug: 'forever21', code: 'F21SAVE20', description: '20% off your order', discountType: 'percent', discountValue: 20, isVerified: true },
  { retailerSlug: 'express', code: 'EXPWOW', description: '$15 off purchases over $50', discountType: 'fixed', discountValue: 15, minOrderValue: 50, isVerified: true },
  { retailerSlug: 'j-crew', code: 'JCREW30', description: '30% off everything', discountType: 'percent', discountValue: 30, isVerified: true },
  { retailerSlug: 'macys', code: 'MACYSVIP', description: '25% off select items', discountType: 'percent', discountValue: 25, isVerified: true },
  { retailerSlug: 'kohls', code: 'KOHLSEARLY', description: '20% off + free shipping', discountType: 'percent', discountValue: 20, isVerified: true },
  { retailerSlug: 'nike', code: 'NIKEMEMBER', description: '20% off for Nike members', discountType: 'percent', discountValue: 20, isVerified: true },
  { retailerSlug: 'adidas', code: 'ADICLUB', description: '30% off for adiClub members', discountType: 'percent', discountValue: 30, isVerified: true },
  { retailerSlug: 'lululemon', code: 'LULUNEW', description: 'Free shipping on first order', discountType: 'free_shipping', isVerified: true },
  { retailerSlug: 'under-armour', code: 'UAMVP', description: '25% off sitewide', discountType: 'percent', discountValue: 25, isVerified: true },
  { retailerSlug: 'shein', code: 'SHEIN15', description: '15% off first order', discountType: 'percent', discountValue: 15, isVerified: true },
  { retailerSlug: 'revolve', code: 'REVOLVEFREE', description: 'Free shipping & returns', discountType: 'free_shipping', isVerified: true },
  { retailerSlug: 'farfetch', code: 'FF10NEW', description: '10% off first Farfetch order', discountType: 'percent', discountValue: 10, isVerified: true },
  { retailerSlug: 'abercrombie', code: 'ANFFRIEND', description: '25% off for A&F Club members', discountType: 'percent', discountValue: 25, isVerified: true },
  { retailerSlug: 'hollister', code: 'HOLLSAVE', description: '20% off your next order', discountType: 'percent', discountValue: 20, isVerified: true },
  { retailerSlug: 'american-eagle', code: 'AENEW', description: '$10 off orders over $50', discountType: 'fixed', discountValue: 10, minOrderValue: 50, isVerified: true },
  { retailerSlug: 'zappos', code: 'ZAPFREESHIP', description: 'Free shipping & returns always', discountType: 'free_shipping', isVerified: true },
  { retailerSlug: 'rei', code: 'REIMEMBER', description: '20% off for REI members', discountType: 'percent', discountValue: 20, isVerified: true },
  { retailerSlug: 'reformation', code: 'REFSAVE10', description: '10% off your purchase', discountType: 'percent', discountValue: 10, isVerified: true },
  { retailerSlug: 'everlane', code: 'EVERLANE10', description: '$10 off your first order', discountType: 'fixed', discountValue: 10, isVerified: true },
  { retailerSlug: 'mango', code: 'MANGO15', description: '15% off new arrivals', discountType: 'percent', discountValue: 15, isVerified: true },
  { retailerSlug: 'uniqlo', code: 'UNIQLO20', description: '20% off select collections', discountType: 'percent', discountValue: 20, isVerified: true },
  { retailerSlug: 'target-fashion', code: 'TARGET5', description: '5% off with RedCard', discountType: 'percent', discountValue: 5, isVerified: true },
  { retailerSlug: 'walmart-fashion', code: 'WALMART10', description: '$10 off $50+ online', discountType: 'fixed', discountValue: 10, minOrderValue: 50, isVerified: true },
];

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let seeded = 0;
  for (const coupon of COUPONS) {
    const retailer = await prisma.retailer.findUnique({ where: { slug: coupon.retailerSlug } });
    if (!retailer) continue;
    await prisma.coupon.upsert({
      where: { id: `${coupon.retailerSlug}-${coupon.code}` },
      create: {
        id: `${coupon.retailerSlug}-${coupon.code}`,
        retailerId: retailer.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: (coupon as {discountValue?: number}).discountValue,
        minOrderValue: (coupon as {minOrderValue?: number}).minOrderValue,
        source: 'manual',
        isVerified: coupon.isVerified,
        isActive: true,
      },
      update: { description: coupon.description, isVerified: true, isActive: true },
    });
    seeded++;
  }

  return NextResponse.json({ ok: true, seeded });
}
