export type FeedType = 'RSS' | 'XML' | 'JSON' | 'CSV' | 'API';

export interface RetailerConfig {
  slug: string;
  name: string;
  baseUrl: string;
  logoUrl?: string;
  feedUrl?: string;
  feedType: FeedType;
  affiliateNetwork?: string;
  category?: string;
  parser: (raw: unknown) => NormalizedProduct[];
}

export interface NormalizedProduct {
  externalId: string;
  title: string;
  description?: string;
  price: number;
  salePrice?: number;
  currency?: string;
  imageUrl?: string;
  productUrl: string;
  brand?: string;
  category?: string;
  gender?: string;
  color?: string;
  size?: string;
  inStock?: boolean;
}
