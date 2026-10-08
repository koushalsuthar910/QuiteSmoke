import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/session';
import { calculateHealth } from '@/lib/health/calculate';
import { HEALTH_METRICS } from '@/lib/health/metrics';

export async function GET() {
  try {
    const user = await requireUser();
    const profile = user.profile!;

    // ============================================================
    // CLOCK 1 — HEALTH RECOVERY
    // Anchored to the last cigarette. Resets when you smoke.
    // This is medically correct: your body's physiological state
    // depends on your most recent nicotine/CO/tar exposure.
    // ============================================================
    const last = await prisma.smokingEvent.findFirst({
      where: { userId: user.id },
      orderBy: { smokedAt: 'desc' },
    });
    const lastMs = last?.smokedAt.getTime() ?? profile.quitStartedAt.getTime();

    const snap = calculateHealth(lastMs, HEALTH_METRICS, {
      cigarettesPerDay: profile.cigarettesPerDay,
      packPrice: profile.packPrice,
      cigarettesPerPack: profile.cigarettesPerPack,
      absorptionFactor: profile.absorptionFactor,
    });

    // ============================================================
    // CLOCK 2 — CUMULATIVE PROGRESS
    // Anchored to the ORIGINAL quit date. NEVER resets.
    // Money you did not spend yesterday is still in your pocket.
    // ============================================================
    const quitMs = profile.quitStartedAt.getTime();
    const totalHoursSinceQuit = Math.max(0, (Date.now() - quitMs) / 3600_000);
    const totalDaysSinceQuit = totalHoursSinceQuit / 24;

    // Total cigarettes the user *would have* smoked since the quit date,
    // if they had never quit at all.
    const totalExpectedCigs = totalDaysSinceQuit * profile.cigarettesPerDay;

    // How many cigarettes have actually been logged since the quit date
    const smokedAgg = await prisma.smokingEvent.aggregate({
      where: { userId: user.id },
      _sum: { quantity: true, cost: true },
    });
    const cigsActuallySmoked = smokedAgg._sum.quantity ?? 0;
    const totalSpent = smokedAgg._sum.cost ?? 0;

    // Cigarettes avoided = expected − actually smoked (never negative)
    const cigarettesAvoided = Math.max(
      0,
      Math.floor(totalExpectedCigs - cigsActuallySmoked)
    );

    // Money saved = cost of avoided cigarettes
    const costPerCig = profile.packPrice / profile.cigarettesPerPack;
    const moneySaved = Math.max(
      0,
      Math.round(cigarettesAvoided * costPerCig * 100) / 100
    );

    return NextResponse.json({
      // health metrics from Clock 1 (reset on smoking — correct)
      ...snap,
      // override the engine's money/avoided values with Clock 2 (cumulative)
      moneySaved,
      cigarettesAvoided,
      // meta
      lastCigaretteMs: lastMs,
      totalSmoked: cigsActuallySmoked,
      totalSpent,
      quitStartedAt: profile.quitStartedAt,
    });
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}