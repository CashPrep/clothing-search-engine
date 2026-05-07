import { NextRequest, NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

export async function POST(req: NextRequest) {
  const key = req.headers.get('x-admin-key');
  if (process.env.ADMIN_KEY && key !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const redis = getRedis();
    const keys = await redis.keys('search:*');
    if (keys.length > 0) await redis.del(...keys);
    return NextResponse.json({ ok: true, flushed: keys.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
