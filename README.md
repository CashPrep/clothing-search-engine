# Clothing Search Engine v2

A full-stack product discovery platform aggregating clothing and products from 50+ online retailers. Users can search vaguely or specifically, see photos, prices, details, direct links, and verified coupons.

## Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js workers
- **Database**: PostgreSQL via Prisma ORM
- **Search**: PostgreSQL full-text search + fuzzy matching
- **Caching**: Redis (Upstash)
- **Job Queue**: BullMQ (Redis-backed)
- **Feed Sources**: RSS/XML product feeds, affiliate APIs, public catalog APIs
- **Coupons**: Coupon ingestion via RetailMeNot feed, Honey API pattern, manual verified coupons

## Setup

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in values.

## Running the Ingestion Workers

```bash
# Run all retailer feed workers
npm run ingest

# Run a single retailer
npm run ingest -- --retailer amazon
```

## Retailers Supported (50+)
See `lib/retailers/index.ts` for the full list.

## Architecture
```
app/
├── api/
│   ├── search/route.ts         # Main search endpoint
│   ├── products/[id]/route.ts  # Single product detail
│   └── coupons/route.ts        # Coupon lookup
lib/
├── db.ts                       # Prisma client singleton
├── search.ts                   # Full-text search logic
├── retailers/
│   ├── index.ts                # Retailer registry
│   ├── types.ts                # Retailer/Product types
│   └── adapters/               # Per-retailer feed parsers
workers/
├── ingestion-worker.ts         # BullMQ worker
├── ingest-all.ts               # CLI entry point
└── coupon-worker.ts            # Coupon ingestion
prisma/
└── schema.prisma               # DB schema
```
