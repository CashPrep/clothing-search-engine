'use client';

import { useEffect, useState } from 'react';
import { BarChart2, Package, Store, Tag, RefreshCw, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Stats {
  productCount: number;
  retailerCount: number;
  couponCount: number;
  cacheInfo: { cachedSearches: number };
  topRetailers: { name: string; slug: string; lastIngested: string | null; _count: { products: number } }[];
  recentProducts: { title: string; price: number; brand: string; retailer: { name: string }; createdAt: string }[];
  timestamp: string;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [flushing, setFlushing] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY ?? '';

  async function fetchStats() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats', { headers: { 'x-admin-key': adminKey } });
      setStats(await res.json());
    } catch { setMessage({ type: 'err', text: 'Failed to load stats' }); }
    setLoading(false);
  }

  async function flushCache() {
    setFlushing(true);
    try {
      const res = await fetch('/api/admin/flush-cache', { method: 'POST', headers: { 'x-admin-key': adminKey } });
      const data = await res.json();
      setMessage({ type: 'ok', text: `Flushed ${data.flushed} cached searches` });
    } catch { setMessage({ type: 'err', text: 'Flush failed' }); }
    setFlushing(false);
  }

  async function triggerIngest() {
    setIngesting(true);
    setMessage({ type: 'ok', text: 'Ingestion started... this may take a minute.' });
    try {
      const res = await fetch('/api/cron/ingest');
      const data = await res.json();
      setMessage({ type: 'ok', text: `Done: ${data.ok} retailers OK, ${data.errors} errors` });
      fetchStats();
    } catch { setMessage({ type: 'err', text: 'Ingestion failed' }); }
    setIngesting(false);
  }

  useEffect(() => { fetchStats(); }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
            <p className="text-zinc-400 mt-1">Clothing Search Engine — live stats & controls</p>
          </div>
          <button onClick={fetchStats} className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>

        {message && (
          <div className={`mb-6 flex items-center gap-3 rounded-xl border p-4 ${
            message.type === 'ok' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-red-500/20 bg-red-500/10 text-red-300'
          }`}>
            {message.type === 'ok' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {message.text}
          </div>
        )}

        {/* Stat Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Products Indexed', value: stats.productCount.toLocaleString(), icon: Package, color: 'text-blue-400' },
              { label: 'Active Retailers', value: stats.retailerCount, icon: Store, color: 'text-purple-400' },
              { label: 'Active Coupons', value: stats.couponCount, icon: Tag, color: 'text-emerald-400' },
              { label: 'Cached Searches', value: stats.cacheInfo?.cachedSearches ?? 0, icon: BarChart2, color: 'text-yellow-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <Icon className={`h-5 w-5 mb-3 ${color}`} />
                <p className="text-3xl font-semibold">{value}</p>
                <p className="text-sm text-zinc-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="font-semibold mb-1">Re-ingest All Retailers</h2>
            <p className="text-sm text-zinc-400 mb-4">Fetch all 50+ retailer feeds and update the product database. Runs automatically every 6 hours via cron.</p>
            <button
              onClick={triggerIngest}
              disabled={ingesting}
              className="flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-200 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${ingesting ? 'animate-spin' : ''}`} />
              {ingesting ? 'Ingesting...' : 'Run Ingestion Now'}
            </button>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="font-semibold mb-1">Flush Search Cache</h2>
            <p className="text-sm text-zinc-400 mb-4">Clear all cached search results from Redis. New searches will hit the database fresh.</p>
            <button
              onClick={flushCache}
              disabled={flushing}
              className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {flushing ? 'Flushing...' : 'Flush Cache'}
            </button>
          </div>
        </div>

        {/* Retailer Table */}
        {stats && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 mb-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800">
              <h2 className="font-semibold">Retailers by Product Count</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="text-left px-6 py-3">Retailer</th>
                    <th className="text-right px-6 py-3">Products</th>
                    <th className="text-right px-6 py-3">Last Ingested</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topRetailers.map((r) => (
                    <tr key={r.slug} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                      <td className="px-6 py-3 font-medium">{r.name}</td>
                      <td className="px-6 py-3 text-right text-zinc-300">{r._count.products.toLocaleString()}</td>
                      <td className="px-6 py-3 text-right text-zinc-400 flex items-center justify-end gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {r.lastIngested ? new Date(r.lastIngested).toLocaleString() : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Products */}
        {stats && stats.recentProducts.length > 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800">
              <h2 className="font-semibold">Recently Ingested Products</h2>
            </div>
            <div className="divide-y divide-zinc-800">
              {stats.recentProducts.map((p, i) => (
                <div key={i} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm line-clamp-1">{p.title}</p>
                    <p className="text-xs text-zinc-400">{p.retailer.name}{p.brand ? ` · ${p.brand}` : ''}</p>
                  </div>
                  <span className="text-sm font-semibold">${p.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-zinc-600 mt-8">
          Last updated: {stats?.timestamp ? new Date(stats.timestamp).toLocaleString() : '—'}
        </p>
      </div>
    </main>
  );
}
