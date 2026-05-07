import { prisma } from './db';
import type { Product, Retailer, Coupon } from '@prisma/client';

export type SearchResult = Product & {
  retailer: Retailer;
  coupons: Coupon[];
};

export interface SearchOptions {
  query: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  category?: string;
  gender?: string;
  color?: string;
  retailerSlug?: string;
  page?: number;
  limit?: number;
}

export async function searchProducts(opts: SearchOptions): Promise<{ results: SearchResult[]; total: number }> {
  const {
    query,
    minPrice,
    maxPrice,
    brand,
    category,
    gender,
    color,
    retailerSlug,
    page = 1,
    limit = 24,
  } = opts;

  const offset = (page - 1) * limit;

  // Build WHERE clause
  const conditions: string[] = ['p."inStock" = true'];
  const params: (string | number)[] = [];
  let paramIdx = 1;

  if (query && query.trim()) {
    // Full-text search with fallback to ILIKE for short queries
    const tsQuery = query.trim().split(/\s+/).join(' & ');
    conditions.push(`p."searchVector" @@ to_tsquery('english', $${paramIdx})`); 
    params.push(tsQuery);
    paramIdx++;
  }

  if (minPrice !== undefined) {
    conditions.push(`p.price >= $${paramIdx}`);
    params.push(minPrice);
    paramIdx++;
  }

  if (maxPrice !== undefined) {
    conditions.push(`p.price <= $${paramIdx}`);
    params.push(maxPrice);
    paramIdx++;
  }

  if (brand) {
    conditions.push(`lower(p.brand) ILIKE $${paramIdx}`);
    params.push(`%${brand.toLowerCase()}%`);
    paramIdx++;
  }

  if (category) {
    conditions.push(`lower(p.category) ILIKE $${paramIdx}`);
    params.push(`%${category.toLowerCase()}%`);
    paramIdx++;
  }

  if (gender) {
    conditions.push(`lower(p.gender) = $${paramIdx}`);
    params.push(gender.toLowerCase());
    paramIdx++;
  }

  if (color) {
    conditions.push(`lower(p.color) ILIKE $${paramIdx}`);
    params.push(`%${color.toLowerCase()}%`);
    paramIdx++;
  }

  if (retailerSlug) {
    conditions.push(`r.slug = $${paramIdx}`);
    params.push(retailerSlug);
    paramIdx++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const rankExpr = query?.trim()
    ? `ts_rank(p."searchVector", to_tsquery('english', $1))`
    : '1';

  const sql = `
    SELECT
      p.*,
      row_to_json(r.*) as retailer,
      coalesce(
        json_agg(c.*) FILTER (WHERE c.id IS NOT NULL AND c."isActive" = true),
        '[]'
      ) as coupons,
      ${rankExpr} AS rank
    FROM "Product" p
    JOIN "Retailer" r ON p."retailerId" = r.id
    LEFT JOIN "Coupon" c ON c."retailerId" = r.id AND c."isActive" = true
    ${whereClause}
    GROUP BY p.id, r.id
    ORDER BY rank DESC, p."updatedAt" DESC
    LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
  `;
  params.push(limit, offset);

  const countSql = `
    SELECT COUNT(DISTINCT p.id)::int as total
    FROM "Product" p
    JOIN "Retailer" r ON p."retailerId" = r.id
    ${whereClause}
  `;

  const [results, countResult] = await Promise.all([
    prisma.$queryRawUnsafe<SearchResult[]>(sql, ...params),
    prisma.$queryRawUnsafe<{ total: number }[]>(countSql, ...params.slice(0, -2)),
  ]);

  return {
    results,
    total: countResult[0]?.total ?? 0,
  };
}
