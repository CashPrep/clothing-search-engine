import { XMLParser } from 'fast-xml-parser';
import type { NormalizedProduct } from '../retailers/types';

interface RssFieldMap {
  idField: string;
  imageField: string;
  priceField: string;
  urlField: string;
}

export function parseRssFeed(raw: unknown, fieldMap: RssFieldMap): NormalizedProduct[] {
  try {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    const text = typeof raw === 'string' ? raw : JSON.stringify(raw);
    const result = parser.parse(text);
    const items: Record<string, string>[] = result?.rss?.channel?.item ?? result?.feed?.entry ?? [];
    return items.map((item, idx) => ({
      externalId: String(item[fieldMap.idField] ?? idx),
      title: item['title'] ?? 'Product',
      description: item['description'] ?? item['g:description'],
      price: parseFloat((item[fieldMap.priceField] ?? '0').replace(/[^0-9.]/g, '')) || 0,
      imageUrl: item[fieldMap.imageField],
      productUrl: item[fieldMap.urlField] ?? item['link'] ?? '',
      brand: item['g:brand'] ?? item['brand'],
      category: item['g:product_type'] ?? item['g:google_product_category'],
      gender: item['g:gender'],
      color: item['g:color'],
      inStock: item['g:availability'] !== 'out of stock',
    }));
  } catch { return []; }
}
