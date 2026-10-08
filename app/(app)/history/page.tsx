'use client';
import { useEffect, useState } from 'react';
import { formatINR } from '@/lib/format';

interface Event {
  id: string;
  quantity: number;
  smokedAt: string;
  cost: number;
  absorbedNicotineMg: number | null;
  trigger: string | null;
  product: { brand: string; productName: string };
}

export default function HistoryPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  async function handleDelete(id: string) {
    const ok = window.confirm(
      'Delete this entry?\n\nYour streak and money will be recalculated as if you never logged this cigarette.'
    );
    if (!ok) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert('Delete failed: ' + (err.error || res.status));
        return;
      }
      // Optimistic UI update
      setEvents(prev => prev.filter(e => e.id !== id));
      // Reload snapshot on other pages too — force full page data refresh
      window.location.reload();
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading…</div>;
  }

  return (
    <div className="max-w-md mx-auto px-5 pt-10 pb-8">
      <h1 className="text-2xl font-semibold mb-1">History</h1>
      <p className="text-sm text-zinc-500 mb-6">
        Your smoking events. Tap the trash icon to remove a mistakenly logged entry.
      </p>

      {events.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🎉</div>
          <div className="font-semibold">No cigarettes logged</div>
          <div className="text-sm text-zinc-500 mt-1">You're doing great.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map(e => (
            <div
              key={e.id}
              className="rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">
                    {e.product.brand} {e.product.productName}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {new Date(e.smokedAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-sm font-semibold text-rose-500">
                    -{formatINR(e.cost, 2)}
                  </div>
                  <button
                    onClick={() => handleDelete(e.id)}
                    disabled={deletingId === e.id}
                    aria-label="Delete entry"
                    className="p-2 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition disabled:opacity-40"
                  >
                    {deletingId === e.id ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" opacity="0.25" />
                        <path d="M12 3a9 9 0 019 9" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                <span className="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900">
                  ×{e.quantity}
                </span>
                {e.absorbedNicotineMg != null && (
                  <span className="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900">
                    ~{e.absorbedNicotineMg.toFixed(2)} mg nicotine
                  </span>
                )}
                {e.trigger && (
                  <span className="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900">
                    {e.trigger}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}