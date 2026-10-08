'use client';
import { useEffect, useState } from 'react';
import { ProgressRing } from '@/components/ProgressRing';
import { KpiCard } from '@/components/KpiCard';
import LogCigaretteSheet from '@/components/LogCigaretteSheet';
import { formatDuration, formatINR } from '@/lib/format';

export default function DashboardPage() {
  const [snap, setSnap] = useState<any>(null);
  const [me, setMe] = useState<any>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(setMe).catch(() => {});
    const load = () => fetch('/api/snapshot').then(r => r.json()).then(setSnap).catch(() => {});
    load();
    const id = setInterval(load, 1000);
    return () => clearInterval(id);
  }, []);

  if (!snap) return <div className="p-8 text-center text-zinc-500">Loading…</div>;

  const days = Math.floor(snap.smokeFreeSeconds / 86400);
  const greeting = days === 0 ? 'Every hour counts' : days < 3 ? 'Great start' : days < 14 ? 'Keep going' : 'Amazing progress';

  return (
    <div className="max-w-md mx-auto px-5 pt-10">
      <div className="mb-4">
        <div className="text-xs uppercase tracking-wider text-zinc-500">{greeting}</div>
        <h1 className="text-2xl font-semibold leading-tight mt-1">
          {me?.profile?.name ? `${me.profile.name}, your body is recovering` : 'Your body is getting closer to normal'}
        </h1>
      </div>

      <div className="flex flex-col items-center py-6">
        <ProgressRing size={220} stroke={14} progress={snap.overall} label={formatDuration(snap.smokeFreeSeconds)} sublabel="smoke-free" />
        <div className="text-center mt-5">
          <div className="text-xs uppercase tracking-wider text-zinc-500">Next milestone</div>
          <div className="text-sm font-medium mt-1 max-w-xs">{snap.nextMilestone.description}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3">
          <div className="text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Saved</div>
          <div className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 tabular-nums">{formatINR(snap.moneySaved, 2)}</div>
        </div>
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3">
          <div className="text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Avoided</div>
          <div className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 tabular-nums">{snap.cigarettesAvoided} cigs</div>
        </div>
      </div>

      <button onClick={() => setSheetOpen(true)}
        className="w-full mt-6 py-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold">
        + I smoked a cigarette
      </button>

      <div className="mt-8 space-y-3 pb-8">
        <h2 className="text-lg font-semibold">Health recovery</h2>
        {snap.metrics.map((m: any) => <KpiCard key={m.id} metric={m} />)}
      </div>

      <p className="text-[11px] text-zinc-500 leading-relaxed text-center pb-8">
        This app provides estimates and educational information based on smoking cessation research.
        It is not a medical diagnosis or a substitute for professional medical advice.
      </p>

      <LogCigaretteSheet open={sheetOpen} onClose={() => setSheetOpen(false)} defaultProductId={me?.profile?.defaultProductId} />
    </div>
  );
}
