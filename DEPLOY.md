# Full Production Deployment Guide — v3

## Stack
- **Frontend + API + Crons**: Vercel
- **Database**: Supabase or Neon (PostgreSQL)
- **Cache + Rate Limiting**: Upstash Redis ✅ already configured

---

## Step 1 — PostgreSQL (pick one, both free)

### Supabase (recommended)
1. https://supabase.com → New Project
2. Settings → Database → Connection String (URI) → copy it
3. Format: `postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres`

### Neon
1. https://neon.tech → New Project → copy connection string

---

## Step 2 — Run Migrations

```bash
export DATABASE_URL="postgresql://..."
npx prisma migrate deploy
```

---

## Step 3 — Seed Retailers & Coupons

```bash
npm run db:seed          # seeds all 50+ retailers into DB
npm run ingest:coupons   # seeds 30 verified coupon codes
```

---

## Step 4 — Run Initial Product Ingestion

```bash
npm run ingest
# or a single retailer:
npm run ingest -- --retailer asos
```

---

## Step 5 — Deploy to Vercel

```bash
npx vercel --prod
```

Or connect GitHub repo at https://vercel.com/new (auto-deploys on push)

### Required Vercel Environment Variables
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
CRON_SECRET=any-random-secret-string
ADMIN_KEY=any-random-admin-key
```

### Already wired in vercel.json (no action needed):
```
UPSTASH_REDIS_REST_URL=https://helpful-pug-117747.upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

---

## Cron Jobs (auto-configured in vercel.json)

| Schedule | Endpoint | Purpose |
|---|---|---|
| Every 6 hours | `/api/cron/ingest` | Re-ingest all retailer feeds |
| Daily at 2am | `/api/cron/coupons` | Refresh coupon database |

---

## Admin Dashboard

Visit `/admin` on your deployed site to:
- See live product/retailer/coupon counts
- Trigger manual ingestion
- Flush Redis cache
- View recently ingested products

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/search?q=...` | Search products |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/coupons?retailer=...` | Get coupons |
| GET | `/api/retailers` | List all retailers |
| GET | `/api/health` | Health check (DB + Redis) |
| GET | `/api/admin/stats` | Admin stats |
| POST | `/api/admin/flush-cache` | Flush Redis cache |
| GET | `/api/cron/ingest` | Trigger ingestion |
| GET | `/api/cron/coupons` | Refresh coupons |

---

## Redis — Already Live ✅
- Host: helpful-pug-117747.upstash.io
- Search results cached 5 min
- Product pages cached 1 hr
- Coupons cached 30 min
- Rate limiting: 60 requests/min per IP
