import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signToken, cookieOptions, COOKIE_NAME } from '@/lib/auth';

const schema = z.object({ email: z.string().email(), password: z.string() });

export async function POST(req: Request) {
  try {
    const { email, password } = schema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { email }, include: { profile: true } });
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = await signToken(user.id);
    const res = NextResponse.json({ ok: true, userId: user.id, onboardingDone: user.profile?.onboardingDone ?? false });
    res.cookies.set(COOKIE_NAME, token, cookieOptions);
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Login failed' }, { status: 400 });
  }
}
