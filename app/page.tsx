'use client';

import { useState, useCallback } from 'react';
import { Search, BadgeCheck, ExternalLink, SlidersHorizontal, X, Loader2, Tag } from 'lucide-react';

interface Coupon {
  id: string;
  code?: string;
  description: string;
  discountType?: string;
  discountValue?: number;
  isVerified: boolean;
}

interface Retailer {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  salePrice?: number;
  imageUrl?: string;
  productUrl: string;
  brand?: string;
  category?: string;
  gender?: string;
  color?: string;
  retailer: Retailer;
  coupons: Coupon[];
}

const SUGGESTIONS = [
  'Black oversized hoodie',
  'Women summer dress under $60',
  'Running shoes Nike',
  'Vintage leather jacket',
  'Linen shirts men',
  'Streetwear cargo pants',
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [gender, setGender] = useState('');
  const [color, setColor] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (q = query) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const params = new URLSearchParams({ q });
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (gender) params.set('gender', gender);
      if (color) params.set('color', color);
      const res = await fetch(`/api/search?${params}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data.results ?? []);
      setTotal(data.total ?? 0);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [query, minPrice, maxPrice, gender, color]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-sm text-zinc-400">
          <Search className="h-3.5 w-3.5" />
          50+ retailers &middot; verified coupons &middot; real-time prices
        </div>
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
          Find any clothing or product across the internet.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          Search broadly like &ldquo;black hoodie&rdquo; or specifically like &ldquo;men&rsquo;s linen beige shirt under $60&rdquo;. We pull the best matches from 50+ retailers with photos, prices, and verified coupon codes.
        </p>

        {/* Search box */}
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className="h-14 flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-base outline-none placeholder:text-zinc-500"
              placeholder="Search any item, style, brand, color, or product..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="h-14 rounded-xl bg-white px-6 font-medium text-black transition hover:bg-zinc-200 disabled:opacity-50 flex items-center gap-2 justify-center"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="h-14 rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-zinc-300 hover:border-zinc-500"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <input
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none placeholder:text-zinc-500"
              />
              <input
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none placeholder:text-zinc-500"
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 outline-none"
              >
                <option value="">Any gender</option>
                <option value="male">Men</option>
                <option value="female">Women</option>
                <option value="unisex">Unisex</option>
              </select>
              <input
                placeholder="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none placeholder:text-zinc-500"
              />
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => { setQuery(s); handleSearch(s); }}
                className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300 hover:bg-zinc-700"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      {error && (
        <div className="mx-auto max-w-5xl px-6 pb-4">
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-300">{error}</div>
        </div>
      )}

      {searched && !loading && (
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">
              {total > 0 ? `${total.toLocaleString()} results for "${query}"` : `No results for "${query}"`}
            </h2>
            {total > 0 && <p className="text-zinc-400">Photos, prices, retailer links, and verified coupon codes.</p>}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 flex flex-col">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="h-64 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-64 w-full bg-zinc-800 flex items-center justify-center">
                    <Tag className="h-10 w-10 text-zinc-600" />
                  </div>
                )}

                <div className="flex flex-col flex-1 p-4">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-xs text-zinc-400 font-medium">{product.retailer.name}</span>
                    <div className="text-right">
                      {product.salePrice ? (
                        <>
                          <span className="text-base font-semibold text-emerald-400">${product.salePrice.toFixed(2)}</span>
                          <span className="ml-1.5 text-xs line-through text-zinc-500">${product.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="text-base font-semibold">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm font-medium leading-snug line-clamp-2">{product.title}</h3>

                  {(product.brand || product.color) && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {product.brand && <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{product.brand}</span>}
                      {product.color && <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{product.color}</span>}
                    </div>
                  )}

                  {product.coupons.length > 0 && (
                    <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified coupon
                      </div>
                      {product.coupons[0].code && (
                        <p className="mt-0.5 font-mono font-bold text-white">{product.coupons[0].code}</p>
                      )}
                      <p className="text-zinc-300">{product.coupons[0].description}</p>
                    </div>
                  )}

                  <a
                    href={product.productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto pt-3 inline-flex items-center gap-1.5 text-sm text-white underline underline-offset-4 hover:text-zinc-300"
                  >
                    View at {product.retailer.name}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
