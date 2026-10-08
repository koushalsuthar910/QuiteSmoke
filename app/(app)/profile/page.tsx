'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [me, setMe] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetch('/api/auth/me').then(r => r.json()).then(setMe).catch(() => {}); }, []);

  if (!me) return <div className="p-8 text-center text-zinc-500">Loading…</div>;

  const p = me.profile;

  async function save(patch: any) {
    setSaving(true); setSaved(false);
    await fetch('/api/profile', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto px-5 pt-10 pb-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-zinc-500 mt-1">{me.email}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Personal</h2>
        <Field label="Name" value={p.name ?? ''} onSave={v => save({ name: v })} />
        <Field label="Age" type="number" value={String(p.age ?? '')} onSave={v => save({ age: v ? parseInt(v) : null })} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Smoking</h2>
        <Field label="Cigarettes per day" type="number" value={String(p.cigarettesPerDay)} onSave={v => save({ cigarettesPerDay: parseInt(v) || 20 })} />
        <Field label="Pack price (₹)" type="number" value={String(p.packPrice)} onSave={v => save({ packPrice: parseFloat(v) || 0 })} />
        <Field label="Cigarettes per pack" type="number" value={String(p.cigarettesPerPack)} onSave={v => save({ cigarettesPerPack: parseInt(v) || 1 })} />
        <Field label="Quit date/time" type="datetime-local"
  value={toLocalDatetimeInput(p.quitStartedAt)}
  onSave={v => save({ quitStartedAt: new Date(v).toISOString() })} />
</section>

      <section className="pt-4">
        <button onClick={logout} className="w-full py-3 rounded-2xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-semibold">
          Log out
        </button>
      </section>

      {saved && <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-emerald-600 text-white text-sm">Saved</div>}
    </div>
  );
}

function Field({ label, value, onSave, type = 'text' }: { label: string; value: string; onSave: (v: string) => void; type?: string }) {
  const [v, setV] = useState(value);
  const [editing, setEditing] = useState(false);

  useEffect(() => setV(value), [value]);

  return (
    <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900 px-4 py-3">
      <div className="text-xs text-zinc-500 mb-1">{label}</div>
      <div className="flex gap-2">
        <input type={type} value={v} onChange={e => setV(e.target.value)}
          onFocus={() => setEditing(true)}
          className="flex-1 bg-transparent outline-none text-sm" />
        {editing && v !== value && (
          <button onClick={() => { onSave(v); setEditing(false); }} className="text-emerald-600 text-xs font-semibold">
            Save
          </button>
        )}
      </div>
    </div>
  );
}
// Convert a UTC ISO string to a local "YYYY-MM-DDTHH:MM" string that
// datetime-local inputs expect. Avoids timezone drift on edit.
function toLocalDatetimeInput(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
