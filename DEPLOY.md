# Production Deployment Guide

## Stack
- **Frontend + API**: Vercel (free tier)
- **Database**: Supabase or Neon PostgreSQL (free tier)
- **Cache**: Upstash Redis ✅ already configured

---

## Step 1 — Get a PostgreSQL database (free)

### Option A: Supabase (recommended)
1. Go to https://supabase.com → New Project
2. Copy your connection string from: Settings → Database → Connection String (URI mode)
3. It looks like: `postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres`

### Option B: Neon
1. Go to https://neon.tech → New Project
2. Copy the connection string from the dashboard

---

## Step 2 — Run the database migration

```bash
# Set your DATABASE_URL first
export DATABASE_URL="postgresql://..."

# Run migration (creates all tables + search vector trigger)
npx prisma migrate deploy

# Or for local dev:
npx prisma migrate dev
```

---

## Step 3 — Seed coupons

```bash
npm run ingest:coupons
```

---

## Step 4 — Run product ingestion

```bash
# All 50+ retailers
npm run ingest

# Single retailer
npm run ingest -- --retailer asos
```

---

## Step 5 — Deploy to Vercel

```bash
npx vercel --prod
```

Or push to GitHub and connect the repo at https://vercel.com/new

Add these environment variables in Vercel dashboard:
```
DATABASE_URL=postgresql://...
UPSTASH_REDIS_REST_URL=https://helpful-pug-117747.upstash.io
UPSTASH_REDIS_REST_TOKEN=gQAAAAAAAcvzAAIgcDEyYmE5ZTZjYWY5Njc0MWVlYTE4N2FlZDdiNThjYTVjYg
```

---

## Step 6 — Set up cron for re-ingestion (keeps products fresh)

In `vercel.json` you can add a cron job:

```json
{
  "crons": [{
    "path": "/api/cron/ingest",
    "schedule": "0 */6 * * *"
  }]
}
```

Then create `app/api/cron/ingest/route.ts` that triggers the ingestion queue.

---

## Redis is already live ✅
- Host: helpful-pug-117747.upstash.io
- All search results are cached for 5 minutes
- Product pages cached for 1 hour
- Coupon lookups cached for 30 minutes
