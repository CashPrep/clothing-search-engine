import type { NormalizedProduct } from '../retailers/types';

export function parseGoogleShoppingFeed(raw: unknown): NormalizedProduct[] {
  // Google Shopping feed (Merchant Center export format)
  try {
    const items = raw as { id: string; title: string; description?: string; price: string; image_link?: string; link?: string; brand?: string; product_type?: string; gender?: string; color?: string; availability?: string }[];
    return items.map((item) => ({
      externalId: item.id,
      title: item.title,
      description: item.description,
      price: parseFloat((item.price ?? '0').replace(/[^0-9.]/g, '')) || 0,
      imageUrl: item.image_link,
      productUrl: item.link ?? '',
      brand: item.brand,
      category: item.product_type,
      gender: item.gender,
      color: item.color,
      inStock: item.availability !== 'out of stock',
    }));
  } catch { return []; }
}
