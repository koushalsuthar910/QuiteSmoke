import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/session';

export async function GET() {
  try {
    const user = await requireUser();
    const events = await prisma.smokingEvent.findMany({
      where: { userId: user.id }, orderBy: { smokedAt: 'desc' }, include: { product: true }, take: 200,
    });
    return NextResponse.json(events);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const { productId, quantity = 1, trigger, notes, smokedAt } = body;

    const product = await prisma.cigaretteProduct.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: 'Unknown product' }, { status: 400 });

    const costPerCig = product.packPrice / product.cigarettesPerPack;
    const absorbed = (product.nicotine_mg ?? 0) * (user.profile?.absorptionFactor ?? 0.7) * quantity;

    await prisma.quitSession.updateMany({
      where: { userId: user.id, endedAt: null },
      data: { endedAt: new Date(), endReason: 'relapse' },
    });
    const session = await prisma.quitSession.create({ data: { userId: user.id } });

    const event = await prisma.smokingEvent.create({
      data: {
        userId: user.id, sessionId: session.id, productId: product.id, quantity,
        smokedAt: smokedAt ? new Date(smokedAt) : new Date(),
        nicotineMg: product.nicotine_mg, tarMg: product.tar_mg, coMg: product.carbon_monoxide_mg,
        absorbedNicotineMg: absorbed, cost: costPerCig * quantity, trigger, notes,
      },
    });
    return NextResponse.json(event);
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    // Verify ownership — user can only delete their own events
    const event = await prisma.smokingEvent.findUnique({ where: { id } });
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    if (event.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.smokingEvent.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Server error', detail: e?.message }, { status: 500 });
  }
}
