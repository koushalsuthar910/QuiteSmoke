import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/session';
import { calculateHealth } from '@/lib/health/calculate';
import { HEALTH_METRICS } from '@/lib/health/metrics';

export async function GET() {
  try {
    const user = await requireUser();
    const profile = user.profile!;
    const last = await prisma.smokingEvent.findFirst({ where: { userId: user.id }, orderBy: { smokedAt: 'desc' } });

    const lastMs = last?.smokedAt.getTime() ?? profile.quitStartedAt.getTime();

    const snap = calculateHealth(lastMs, HEALTH_METRICS, {
      cigarettesPerDay: profile.cigarettesPerDay,
      packPrice: profile.packPrice,
      cigarettesPerPack: profile.cigarettesPerPack,
      absorptionFactor: profile.absorptionFactor,
    });

    const agg = await prisma.smokingEvent.aggregate({ where: { userId: user.id }, _sum: { quantity: true } });
    const totalSpent = await prisma.smokingEvent.aggregate({ where: { userId: user.id }, _sum: { cost: true } });

    return NextResponse.json({
      ...snap,
      lastCigaretteMs: lastMs,
      totalSmoked: agg._sum.quantity ?? 0,
      totalSpent: totalSpent._sum.cost ?? 0,
      quitStartedAt: profile.quitStartedAt,
    });
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
