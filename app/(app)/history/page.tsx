'use client';
import { useEffect, useState } from 'react';
import { formatINR } from '@/lib/format';

export default function HistoryPage() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => { fetch('/api/events').then(r => r.json()).then(setEvents).catch(() => {}); }, []);

  return (
    <div className="max-w-md mx-auto px-5 pt-10 pb-8">
      <h1 className="text-2xl font-semibold mb-1">History</h1>
      <p className="text-sm text-zinc-500 mb-6">Your smoking events and progress.</p>

      {events.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🎉</div>
          <div className="font-semibold">No cigarettes logged</div>
          <div className="text-sm text-zinc-500 mt-1">You're doing great.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map(e => (
            <div key={e.id} className="rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{e.product.brand} {e.product.productName}</div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {new Date(e.smokedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
                <div className="text-sm font-semibold text-rose-500">-{formatINR(e.cost, 2)}</div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                <span className="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900">×{e.quantity}</span>
                {e.absorbedNicotineMg != null && <span className="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900">~{e.absorbedNicotineMg.toFixed(2)} mg nicotine</span>}
                {e.trigger && <span className="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900">{e.trigger}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
