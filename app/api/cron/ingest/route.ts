/**
 * Vercel Cron Job — runs every 6 hours
 * Queues all retailer feed ingestion jobs
 * Protected by CRON_SECRET env var
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { RETAILERS } from '@/lib/retailers';
import { getRedis } from '@/lib/redis';

export const maxDuration = 60;

async function ingestRetailer(slug: string) {
  const config = RETAILERS.find((r) => r.slug === slug);
  if (!config || !config.feedUrl) return { slug, status: 'skipped', count: 0 };

  try {
    const res = await fetch(config.feedUrl, {
      headers: { 'User-Agent': 'ClothingSearchBot/2.0' },
      signal: AbortSignal.timeout(20_000),
    });
    const contentType = res.headers.get('content-type') ?? '';
    const rawData = contentType.includes('json') ? await res.json() : await res.text();
    const products = config.parser(rawData);

    const retailer = await prisma.retailer.upsert({
      where: { slug: config.slug },
      create: {
        slug: config.slug, name: config.name, baseUrl: config.baseUrl,
        feedUrl: config.feedUrl, feedType: config.feedType as 'RSS' | 'XML' | 'JSON' | 'CSV' | 'API',
        affiliateNetwork: config.affiliateNetwork,
      },
      update: { lastIngested: new Date() },
    });

    const BATCH = 50;
    let upserted = 0;
    for (let i = 0; i < products.length; i += BATCH) {
      await Promise.allSettled(
        products.slice(i, i + BATCH).map((p) =>
          prisma.product.upsert({
            where: { retailerId_externalId: { retailerId: retailer.id, externalId: p.externalId } },
            create: {
              externalId: p.externalId, retailerId: retailer.id, title: p.title,
              description: p.description, price: p.price, salePrice: p.salePrice,
              currency: p.currency ?? 'USD', imageUrl: p.imageUrl, productUrl: p.productUrl,
              brand: p.brand, category: p.category, gender: p.gender, color: p.color,
              inStock: p.inStock ?? true,
            },
            update: {
              title: p.title, price: p.price, salePrice: p.salePrice,
              imageUrl: p.imageUrl, inStock: p.inStock ?? true,
            },
          })
        )
      );
      upserted += Math.min(BATCH, products.length - i);
    }

    await prisma.retailer.update({ where: { id: retailer.id }, data: { lastIngested: new Date() } });
    return { slug, status: 'ok', count: upserted };
  } catch (err) {
    return { slug, status: 'error', error: String(err) };
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startedAt = Date.now();
  const results: { slug: string; status: string; count?: number; error?: string }[] = [];

  // Process retailers in parallel batches of 5
  const slugs = RETAILERS.map((r) => r.slug);
  for (let i = 0; i < slugs.length; i += 5) {
    const batch = await Promise.all(slugs.slice(i, i + 5).map(ingestRetailer));
    results.push(...batch);
  }

  // Invalidate search cache after ingestion
  try {
    const redis = getRedis();
    const keys = await redis.keys('search:*');
    if (keys.length > 0) await redis.del(...keys);
  } catch { /* optional */ }

  const summary = {
    completedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt,
    total: results.length,
    ok: results.filter((r) => r.status === 'ok').length,
    skipped: results.filter((r) => r.status === 'skipped').length,
    errors: results.filter((r) => r.status === 'error').length,
    results,
  };

  console.log('[cron/ingest]', JSON.stringify(summary));
  return NextResponse.json(summary);
}
