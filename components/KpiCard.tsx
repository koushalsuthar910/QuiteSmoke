'use client';
import { ProgressRing } from './ProgressRing';

export function KpiCard({ metric }: { metric: any }) {
  const nm = metric.nextMilestone;
  const timeLeft = nm ? (nm.hours_after_quitting >= 24
    ? `${Math.round(nm.hours_after_quitting / 24)}d`
    : `${Math.round(nm.hours_after_quitting * 10) / 10}h`) : null;
  return (
    <div className="rounded-3xl border border-zinc-100 dark:border-zinc-800 p-4 flex items-center gap-4">
      <ProgressRing size={72} stroke={7} progress={metric.progress} label={`${Math.round(metric.progress)}`} />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-zinc-900 dark:text-white text-sm">{metric.name}</div>
        <div className="text-xs text-zinc-500 mt-1 line-clamp-2">{metric.description}</div>
        {timeLeft && <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">next in {timeLeft}</div>}
      </div>
    </div>
  );
}
