import { Search, BadgeCheck, ExternalLink } from 'lucide-react';
import { mockProducts } from '@/lib/mock-data';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
            <Search className="h-4 w-4" />
            Retail search + verified coupons
          </div>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
            Search fashion and products across online retailers.
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            Enter something broad like “black summer dress” or highly specific like “men’s oversized cream linen shirt under $50” and discover the best matches instantly.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-2xl shadow-black/20">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                className="h-14 flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-base outline-none ring-0 placeholder:text-zinc-500"
                placeholder="Search any item, style, brand, or product..."
              />
              <button className="h-14 rounded-xl bg-white px-6 font-medium text-black transition hover:bg-zinc-200">
                Search
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-zinc-400">
              <span className="rounded-full bg-zinc-800 px-3 py-1">Vintage leather jacket</span>
              <span className="rounded-full bg-zinc-800 px-3 py-1">Running shoes under $100</span>
              <span className="rounded-full bg-zinc-800 px-3 py-1">Minimalist desk lamp</span>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Best matches</h2>
            <p className="text-zinc-400">Photos, pricing, details, direct retailer links, and coupon codes.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {mockProducts.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
              <img src={product.image} alt={product.title} className="h-72 w-full object-cover" />
              <div className="p-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm text-zinc-400">{product.retailer}</span>
                  <span className="text-lg font-semibold">{product.price}</span>
                </div>
                <h3 className="text-lg font-medium leading-snug">{product.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{product.details}</p>

                {product.coupon && (
                  <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <BadgeCheck className="h-4 w-4" />
                      Verified coupon
                    </div>
                    <p className="mt-1 font-medium text-white">{product.coupon.code}</p>
                    <p className="text-zinc-300">{product.coupon.description}</p>
                  </div>
                )}

                <a
                  href={product.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-white underline underline-offset-4"
                >
                  View product
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
