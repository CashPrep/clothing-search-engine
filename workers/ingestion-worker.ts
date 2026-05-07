/**
 * Retailer Feed Ingestion Worker
 * 
 * Uses BullMQ to queue and process retailer feeds.
 * Each job fetches a retailer's product feed, parses it, and upserts products into the DB.
 *
 * Run: npx ts-node workers/ingest-all.ts
 */

import { Worker, Queue, Job } from 'bullmq';
import { prisma } from '../lib/db';
import { RETAILERS } from '../lib/retailers';
import type { NormalizedProduct } from '../lib/retailers/types';

const REDIS_CONN = { host: process.env.REDIS_HOST ?? 'localhost', port: 6379 };

export const ingestionQueue = new Queue('retailer-ingestion', { connection: REDIS_CONN });

interface IngestionJobData {
  retailerSlug: string;
}

export const ingestionWorker = new Worker<IngestionJobData>(
  'retailer-ingestion',
  async (job: Job<IngestionJobData>) => {
    const { retailerSlug } = job.data;
    const config = RETAILERS.find((r) => r.slug === retailerSlug);
    if (!config) throw new Error(`Unknown retailer: ${retailerSlug}`);

    console.log(`[ingest] Starting ${config.name}...`);

    // 1. Ensure retailer exists in DB
    const retailer = await prisma.retailer.upsert({
      where: { slug: config.slug },
      create: {
        slug: config.slug,
        name: config.name,
        baseUrl: config.baseUrl,
        feedUrl: config.feedUrl,
        feedType: config.feedType as 'RSS' | 'XML' | 'JSON' | 'CSV' | 'API',
        affiliateNetwork: config.affiliateNetwork,
      },
      update: {
        name: config.name,
        baseUrl: config.baseUrl,
        feedUrl: config.feedUrl,
      },
    });

    if (!config.feedUrl) {
      console.log(`[ingest] ${config.name}: no feedUrl configured, skipping`);
      return;
    }

    // 2. Fetch feed
    let rawData: unknown;
    try {
      const res = await fetch(config.feedUrl, {
        headers: {
          'User-Agent': 'ClothingSearchBot/1.0 (product aggregator)',
          'Accept': 'application/xml,application/json,text/xml,text/html,*/*',
        },
        signal: AbortSignal.timeout(30_000),
      });
      const contentType = res.headers.get('content-type') ?? '';
      if (contentType.includes('json')) {
        rawData = await res.json();
      } else {
        rawData = await res.text();
      }
    } catch (err) {
      console.error(`[ingest] ${config.name}: fetch failed`, err);
      throw err;
    }

    // 3. Parse feed
    let products: NormalizedProduct[] = [];
    try {
      products = config.parser(rawData);
    } catch (err) {
      console.error(`[ingest] ${config.name}: parse failed`, err);
      return;
    }

    console.log(`[ingest] ${config.name}: parsed ${products.length} products`);

    // 4. Upsert products in batches
    const BATCH_SIZE = 100;
    let upserted = 0;
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map((p) =>
          prisma.product.upsert({
            where: {
              retailerId_externalId: {
                retailerId: retailer.id,
                externalId: p.externalId,
              },
            },
            create: {
              externalId: p.externalId,
              retailerId: retailer.id,
              title: p.title,
              description: p.description,
              price: p.price,
              salePrice: p.salePrice,
              currency: p.currency ?? 'USD',
              imageUrl: p.imageUrl,
              productUrl: p.productUrl,
              brand: p.brand,
              category: p.category,
              gender: p.gender,
              color: p.color,
              inStock: p.inStock ?? true,
            },
            update: {
              title: p.title,
              description: p.description,
              price: p.price,
              salePrice: p.salePrice,
              imageUrl: p.imageUrl,
              productUrl: p.productUrl,
              brand: p.brand,
              category: p.category,
              inStock: p.inStock ?? true,
            },
          })
        )
      );
      upserted += batch.length;
      job.updateProgress(Math.round((upserted / products.length) * 100));
    }

    // 5. Mark retailer last ingested
    await prisma.retailer.update({
      where: { id: retailer.id },
      data: { lastIngested: new Date() },
    });

    console.log(`[ingest] ${config.name}: done (${upserted} products)`);
  },
  { connection: REDIS_CONN, concurrency: 5 }
);
