/**
 * CLI entry point: queue all (or specific) retailer ingestion jobs
 * Usage:
 *   npx ts-node workers/ingest-all.ts
 *   npx ts-node workers/ingest-all.ts --retailer asos
 */

import { ingestionQueue, ingestionWorker } from './ingestion-worker';
import { RETAILERS } from '../lib/retailers';

const args = process.argv.slice(2);
const retailerArg = args.includes('--retailer') ? args[args.indexOf('--retailer') + 1] : null;

async function main() {
  const targets = retailerArg
    ? RETAILERS.filter((r) => r.slug === retailerArg)
    : RETAILERS;

  if (targets.length === 0) {
    console.error(`No retailer found: ${retailerArg}`);
    process.exit(1);
  }

  console.log(`[ingest-all] Queuing ${targets.length} retailers...`);

  for (const retailer of targets) {
    await ingestionQueue.add(
      `ingest-${retailer.slug}`,
      { retailerSlug: retailer.slug },
      { attempts: 3, backoff: { type: 'exponential', delay: 5000 } }
    );
  }

  console.log('[ingest-all] All jobs queued. Worker processing...');

  // Wait for the worker to drain
  ingestionWorker.on('completed', (job) => {
    console.log(`[ingest-all] ✓ ${job.data.retailerSlug} completed`);
  });
  ingestionWorker.on('failed', (job, err) => {
    console.error(`[ingest-all] ✗ ${job?.data.retailerSlug} failed:`, err.message);
  });
}

main().catch(console.error);
