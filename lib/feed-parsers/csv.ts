import type { NormalizedProduct } from '../retailers/types';

export function parseCsvFeed(raw: string): NormalizedProduct[] {
  try {
    const lines = raw.trim().split('\n');
    const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
    return lines.slice(1).map((line, idx) => {
      const cols = line.split(',').map((c) => c.trim().replace(/"/g, ''));
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = cols[i] ?? ''; });
      return {
        externalId: row['id'] ?? row['sku'] ?? String(idx),
        title: row['title'] ?? row['name'] ?? 'Product',
        description: row['description'] ?? row['desc'],
        price: parseFloat(row['price'] ?? '0') || 0,
        imageUrl: row['image_link'] ?? row['image'] ?? row['imageUrl'],
        productUrl: row['link'] ?? row['url'] ?? row['productUrl'] ?? '',
        brand: row['brand'],
        category: row['product_type'] ?? row['category'],
        gender: row['gender'],
        color: row['color'],
        inStock: row['availability'] !== 'out of stock',
      };
    });
  } catch { return []; }
}
