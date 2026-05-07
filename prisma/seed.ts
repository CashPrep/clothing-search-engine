/**
 * Prisma seed — bootstraps all retailers into DB
 * Run: npx ts-node --project tsconfig.node.json prisma/seed.ts
 */
import { PrismaClient } from '@prisma/client';
import { RETAILERS } from '../lib/retailers';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding retailers...');
  for (const config of RETAILERS) {
    await prisma.retailer.upsert({
      where: { slug: config.slug },
      create: {
        slug: config.slug,
        name: config.name,
        baseUrl: config.baseUrl,
        feedUrl: config.feedUrl,
        feedType: config.feedType as 'RSS' | 'XML' | 'JSON' | 'CSV' | 'API',
        affiliateNetwork: config.affiliateNetwork,
        isActive: true,
      },
      update: { name: config.name, baseUrl: config.baseUrl, feedUrl: config.feedUrl },
    });
    console.log(`  ✓ ${config.name}`);
  }
  console.log(`Done. ${RETAILERS.length} retailers seeded.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
