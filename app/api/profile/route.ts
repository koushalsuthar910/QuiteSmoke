import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/session';

export async function PATCH(req: Request) {
  try {
    const user = await requireUser();
    const allowed = ['name','age','sex','cigarettesPerDay','packPrice','cigarettesPerPack','currency',
                     'absorptionFactor','defaultProductId','smokingYears','goal','quitStartedAt','onboardingDone'];
    const data: any = {};
    const body = await req.json();
    for (const k of allowed) if (k in body) data[k] = body[k];
    if (data.quitStartedAt) data.quitStartedAt = new Date(data.quitStartedAt);
    const updated = await prisma.profile.update({ where: { userId: user.id }, data });
    return NextResponse.json(updated);
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: e?.message || 'Update failed' }, { status: 400 });
  }
}
