'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product { id: string; brand: string; productName: string; packPrice: number; cigarettesPerPack: number; }

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

const now = new Date();
const localIso = toLocalDatetimeInput(now);

  const [form, setForm] = useState({
    name: '', age: '', sex: '',
    cigarettesPerDay: 20,
    defaultProductId: '',
    packPrice: 200, cigarettesPerPack: 20,
    smokingYears: 5,
    quitStartedAt: localIso,
    goal: 'quit_completely',
  });

  useEffect(() => { fetch('/api/products').then(r => r.json()).then(setProducts).catch(() => {}); }, []);

  const totalSteps = 6;
  const next = () => setStep(s => Math.min(totalSteps - 1, s + 1));
  const back = () => setStep(s => Math.max(0, s - 1));

  async function save() {
    setSaving(true); setError('');
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name || null,
        age: form.age ? parseInt(form.age) : null,
        sex: form.sex || null,
        cigarettesPerDay: Number(form.cigarettesPerDay),
        packPrice: Number(form.packPrice),
        cigarettesPerPack: Number(form.cigarettesPerPack),
        smokingYears: Number(form.smokingYears),
        defaultProductId: form.defaultProductId || null,
        quitStartedAt: new Date(form.quitStartedAt).toISOString(),
        goal: form.goal,
        onboardingDone: true,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return setError(data.error || 'Failed to save');
    router.push('/dashboard');
    router.refresh();
  }

  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="min-h-dvh flex flex-col max-w-md mx-auto px-5 py-8">
      <div className="h-1 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden mb-8">
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1">
        {step === 0 && (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">What should we call you?</h1>
            <p className="text-sm text-zinc-500">Optional — you can skip this.</p>
            <input autoFocus value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Your name" className="w-full px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">A bit about you</h1>
            <input type="number" min={13} max={120} value={form.age} onChange={e => setForm({ ...form, age: e.target.value })}
              placeholder="Age" className="w-full px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 outline-none" />
            <div className="flex gap-2 flex-wrap">
              {['male', 'female', 'other', 'prefer_not_to_say'].map(s => (
                <button key={s} type="button" onClick={() => setForm({ ...form, sex: s })}
                  className={`px-4 py-2 rounded-full text-sm ${form.sex === s ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-900'}`}>
                  {s.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">How many cigarettes per day?</h1>
            <input type="number" min={1} max={100} value={form.cigarettesPerDay}
              onChange={e => setForm({ ...form, cigarettesPerDay: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 outline-none text-2xl text-center" />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Which brand do you smoke?</h1>
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {products.map(p => (
                <button key={p.id} type="button"
                  onClick={() => setForm({ ...form, defaultProductId: p.id, packPrice: p.packPrice, cigarettesPerPack: p.cigarettesPerPack })}
                  className={`text-left px-3 py-2 rounded-xl text-sm ${form.defaultProductId === p.id ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-900'}`}>
                  <div className="font-medium">{p.brand}</div>
                  <div className="text-xs opacity-70">{p.productName} · ₹{p.packPrice}</div>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div>
                <label className="text-xs text-zinc-500">Pack price (₹)</label>
                <input type="number" value={form.packPrice} onChange={e => setForm({ ...form, packPrice: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 outline-none" />
              </div>
              <div>
                <label className="text-xs text-zinc-500">Cigs per pack</label>
                <input type="number" value={form.cigarettesPerPack} onChange={e => setForm({ ...form, cigarettesPerPack: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 outline-none" />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">When did you quit?</h1>
            <p className="text-sm text-zinc-500">Set this to a past date if you already stopped smoking.</p>
            <input type="datetime-local" value={form.quitStartedAt} onChange={e => setForm({ ...form, quitStartedAt: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 outline-none" />
            <div className="text-xs text-zinc-500">Smoke-free time will be calculated from this moment.</div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">What is your goal?</h1>
            <button type="button" onClick={() => setForm({ ...form, goal: 'quit_completely' })}
              className={`w-full text-left px-4 py-4 rounded-2xl ${form.goal === 'quit_completely' ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-900'}`}>
              <div className="font-semibold">Quit completely</div>
              <div className="text-sm opacity-80 mt-1">Stop smoking entirely</div>
            </button>
            <button type="button" onClick={() => setForm({ ...form, goal: 'reduce_gradually' })}
              className={`w-full text-left px-4 py-4 rounded-2xl ${form.goal === 'reduce_gradually' ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-900'}`}>
              <div className="font-semibold">Reduce gradually</div>
              <div className="text-sm opacity-80 mt-1">Slowly cut down over time</div>
            </button>
          </div>
        )}

        {error && <div className="text-sm text-rose-500 mt-4">{error}</div>}
      </div>

      <div className="flex gap-2 mt-8">
        {step > 0 && (
          <button onClick={back} className="px-6 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 font-medium">Back</button>
        )}
        {step < totalSteps - 1 ? (
          <button onClick={next} className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white font-semibold">Continue</button>
        ) : (
          <button onClick={save} disabled={saving} className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white font-semibold disabled:opacity-50">
            {saving ? 'Saving…' : 'Start tracking'}
          </button>
        )}
      </div>
    </div>
  );
}
function toLocalDatetimeInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
