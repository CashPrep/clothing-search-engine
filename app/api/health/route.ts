import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getRedis } from '@/lib/redis';

export async function GET() {
  const checks: Record<string, string> = {};

  // DB check
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'ok';
  } catch (e) {
    checks.database = `error: ${String(e)}`;
  }

  // Redis check
  try {
    const redis = getRedis();
    await redis.set('health:ping', '1', { ex: 10 });
    checks.redis = 'ok';
  } catch (e) {
    checks.redis = `error: ${String(e)}`;
  }

  // Product count
  try {
    const count = await prisma.product.count();
    checks.products = `${count} indexed`;
  } catch { checks.products = 'unknown'; }

  // Retailer count
  try {
    const count = await prisma.retailer.count();
    checks.retailers = `${count} active`;
  } catch { checks.retailers = 'unknown'; }

  const allOk = checks.database === 'ok' && checks.redis === 'ok';
  return NextResponse.json(
    { status: allOk ? 'healthy' : 'degraded', checks, timestamp: new Date().toISOString() },
    { status: allOk ? 200 : 503 }
  );
}
