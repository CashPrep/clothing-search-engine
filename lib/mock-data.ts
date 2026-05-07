export type Product = {
  id: string;
  title: string;
  retailer: string;
  price: string;
  image: string;
  details: string;
  url: string;
  coupon?: {
    code: string;
    description: string;
    verified: boolean;
  };
};

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Oversized Linen Button-Up Shirt',
    retailer: 'ASOS',
    price: '$42',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    details: 'Relaxed fit, breathable linen blend, available in neutral tones.',
    url: 'https://www.asos.com/',
    coupon: { code: 'STYLE10', description: '10% off select tops', verified: true }
  },
  {
    id: '2',
    title: 'Slim Straight Denim Jeans',
    retailer: 'Nordstrom',
    price: '$68',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80',
    details: 'Mid-wash denim with stretch comfort and tapered leg.',
    url: 'https://www.nordstrom.com/',
    coupon: { code: 'DENIM15', description: '15% off denim styles', verified: true }
  },
  {
    id: '3',
    title: 'Minimalist Leather Sneakers',
    retailer: 'Zappos',
    price: '$89',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    details: 'Clean low-top silhouette with cushioned insole.',
    url: 'https://www.zappos.com/',
    coupon: { code: 'KICKS20', description: '20% off sneakers today', verified: true }
  },
  {
    id: '4',
    title: 'Cropped Utility Jacket',
    retailer: 'Urban Outfitters',
    price: '$74',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    details: 'Streetwear-inspired jacket with oversized pockets.',
    url: 'https://www.urbanoutfitters.com/',
    coupon: { code: 'LAYER12', description: '12% off outerwear', verified: true }
  }
];
