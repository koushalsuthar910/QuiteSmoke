'use client';
import { useEffect, useState } from 'react';
import { formatINR } from '@/lib/format';

export default function MoneyPage() {
  const [snap, setSnap] = useState<any>(null);
  const [me, setMe] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/snapshot').then(r => r.json()).then(setSnap).catch(() => {});
    fetch('/api/auth/me').then(r => r.json()).then(setMe).catch(() => {});
    fetch('/api/events').then(r => r.json()).then(setEvents).catch(() => {});
  }, []);

  if (!snap || !me) return <div className="p-8 text-center text-zinc-500">Loading…</div>;

  const profile = me.profile;
  const costPerCig = profile.packPrice / profile.cigarettesPerPack;
  const annual = profile.cigarettesPerDay * costPerCig * 365;
  const totalSpent = snap.totalSpent ?? 0;
  const days = snap.smokeFreeSeconds / 86400;
  const todaySaved = Math.min(1, days) * profile.cigarettesPerDay * costPerCig;
  const weekSaved = Math.min(7, days) * profile.cigarettesPerDay * costPerCig;
  const monthSaved = Math.min(30, days) * profile.cigarettesPerDay * costPerCig;
  const yearSaved = Math.min(365, days) * profile.cigarettesPerDay * costPerCig;

  const milestones = [
    { amount: 500, icon: '🍽️', label: 'A nice dinner out' },
    { amount: 2000, icon: '🎧', label: 'Wireless headphones' },
    { amount: 5000, icon: '🏖️', label: 'A weekend trip' },
    { amount: 12000, icon: '📱', label: 'A new mid-range phone' },
    { amount: 30000, icon: '✈️', label: 'A domestic flight + hotel' },
  ];

  return (
    <div className="max-w-md mx-auto px-5 pt-10">
      <div className="text-center">
        <div className="text-xs uppercase tracking-wider text-zinc-500">Money saved</div>
        <div className="text-5xl font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums mt-2">
          {formatINR(snap.moneySaved, 2)}
        </div>
      </div>

      <div className="mt-10 text-center">
        <div className="text-xs uppercase tracking-wider text-zinc-500">Annual saving</div>
        <div className="text-3xl font-semibold tabular-nums mt-1">{formatINR(annual, 0)}</div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3">
        {([
          ['Today', todaySaved], ['This week', weekSaved],
          ['This month', monthSaved], ['This year', yearSaved],
          ['Spent (tracked)', totalSpent], ['Cigs avoided', snap.cigarettesAvoided],
        ] as [string, number][]).map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-zinc-50 dark:bg-zinc-900 px-4 py-3">
            <div className="text-xs uppercase tracking-wider text-zinc-500">{label}</div>
            <div className="text-base font-semibold tabular-nums mt-1">
              {label !== 'Cigs avoided' ? formatINR(value, 0) : value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="text-sm font-medium mb-3">At this rate, you could buy…</div>
        <div className="space-y-2">
          {milestones.map(m => (
            <div key={m.amount} className={`flex items-center gap-3 p-3 rounded-2xl ${snap.moneySaved >= m.amount ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-zinc-50 dark:bg-zinc-900'}`}>
              <span className="text-2xl">{m.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{m.label}</div>
                <div className="text-xs text-zinc-500">{formatINR(m.amount, 0)}</div>
              </div>
              {snap.moneySaved >= m.amount && <span className="text-emerald-600 text-xs font-semibold">Unlocked</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 pb-8">
        <div className="text-sm font-medium mb-3">Recent spending</div>
        {events.length === 0 ? (
          <div className="text-sm text-zinc-500 text-center py-6">No cigarettes logged. Keep it up! 🎉</div>
        ) : (
          <div className="space-y-2">
            {events.slice(0, 5).map(e => (
              <div key={e.id} className="flex justify-between items-center p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900">
                <div>
                  <div className="text-sm font-medium">{e.product.brand} {e.product.productName}</div>
                  <div className="text-xs text-zinc-500">{new Date(e.smokedAt).toLocaleString()}</div>
                </div>
                <div className="text-sm font-semibold text-rose-500">-{formatINR(e.cost, 2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
