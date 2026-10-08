'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product { id: string; brand: string; productName: string; }

export default function LogCigaretteSheet({ open, onClose, defaultProductId }: { open: boolean; onClose: () => void; defaultProductId?: string | null }) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<string>(defaultProductId ?? '');
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch('/api/products').then(r => r.json()).then((list: Product[]) => {
      setProducts(list);
      if (!productId && list[0]) setProductId(list[0].id);
    }).catch(() => {});
  }, [open]);

  async function save() {
    if (!productId) return;
    setSaving(true);
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: qty, trigger: reason }),
    });
    setSaving(false);
    onClose();
    router.refresh();
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50" onClick={onClose}>
      <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-950 rounded-t-3xl p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mb-6" />
        <h2 className="text-lg font-semibold mb-3">What did you smoke?</h2>
        <div className="flex flex-wrap gap-2 mb-6 max-h-32 overflow-y-auto">
          {products.map(p => (
            <button key={p.id} onClick={() => setProductId(p.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${productId === p.id ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-900'}`}>
              {p.brand} {p.productName}
            </button>
          ))}
        </div>

        <h2 className="text-lg font-semibold mb-3">How many?</h2>
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 5].map(n => (
            <button key={n} onClick={() => setQty(n)}
              className={`w-12 h-12 rounded-full font-semibold ${qty === n ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-900'}`}>{n}</button>
          ))}
        </div>

        <h2 className="text-lg font-semibold mb-3">Why? (optional)</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {['Craving', 'Stress', 'Social', 'Alcohol', 'Habit', 'Work', 'Other'].map(r => (
            <button key={r} onClick={() => setReason(r === reason ? null : r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${reason === r ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-900'}`}>{r}</button>
          ))}
        </div>

        <button onClick={save} disabled={saving || !productId}
          className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-semibold disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
        <p className="text-xs text-zinc-500 mt-4 text-center leading-relaxed">
          One lapse doesn't erase your progress. You caught it, logged it, and you're back on track.
        </p>
      </div>
    </div>
  );
}
