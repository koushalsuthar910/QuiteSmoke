import type { HealthMetric, MetricProgress, Milestone, UserProfile, HealthSnapshot } from './types';

function progressAtHours(m: HealthMetric, hours: number): number {
  const ms = m.milestones;
  if (ms.length === 0 || hours <= 0) return 0;
  if (hours <= ms[0].hours_after_quitting) return (hours / ms[0].hours_after_quitting) * ms[0].progress;
  for (let i = 0; i < ms.length - 1; i++) {
    const a = ms[i], b = ms[i + 1];
    if (hours >= a.hours_after_quitting && hours <= b.hours_after_quitting) {
      const t = (hours - a.hours_after_quitting) / (b.hours_after_quitting - a.hours_after_quitting);
      return a.progress + t * (b.progress - a.progress);
    }
  }
  return ms[ms.length - 1].progress;
}

function nextMilestoneFor(m: HealthMetric, hours: number): Milestone | null {
  return m.milestones.find(x => x.hours_after_quitting > hours) ?? null;
}

function statusFor(p: number): string {
  if (p >= 95) return 'recovered';
  if (p >= 60) return 'stabilising';
  return 'recovering';
}

export function calculateHealth(
  lastCigaretteMs: number,
  metrics: HealthMetric[],
  profile: UserProfile,
  nowMs: number = Date.now()
): HealthSnapshot {
  const smokeFreeSeconds = Math.max(0, (nowMs - lastCigaretteMs) / 1000);
  const smokeFreeHours = smokeFreeSeconds / 3600;
  const weighted = metrics.filter(m => m.weight > 0);

  const metricProgress: MetricProgress[] = weighted.map(m => {
    const p = progressAtHours(m, smokeFreeHours);
    return {
      id: m.id, name: m.name, category: m.category, description: m.description,
      progress: Math.round(p * 10) / 10,
      status: statusFor(p),
      nextMilestone: nextMilestoneFor(m, smokeFreeHours),
      disclaimer: m.disclaimer,
    };
  });

  const overall = Math.round(metricProgress.reduce((s, mp, i) => s + mp.progress * weighted[i].weight, 0));

  let nextMilestone: HealthSnapshot['nextMilestone'] = { metricId: '', description: 'All milestones reached', atHours: 0 };
  for (const m of weighted) {
    const nm = nextMilestoneFor(m, smokeFreeHours);
    if (!nm) continue;
    if (!nextMilestone.metricId || nm.hours_after_quitting < nextMilestone.atHours) {
      nextMilestone = { metricId: m.id, description: nm.description, atHours: nm.hours_after_quitting };
    }
  }

  const costPerCig = profile.packPrice / profile.cigarettesPerPack;
  const expectedCigs = (smokeFreeHours / 24) * profile.cigarettesPerDay;
  const cigarettesAvoided = Math.max(0, Math.floor(expectedCigs));
  const moneySaved = Math.round(cigarettesAvoided * costPerCig * 100) / 100;

  return { smokeFreeSeconds, smokeFreeHours, metrics: metricProgress, overall, nextMilestone, moneySaved, cigarettesAvoided };
}
