import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken, cookieOptions, COOKIE_NAME } from '@/lib/auth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = schema.parse(body);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 400 });

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, profile: { create: {} } },
    });
    const token = await signToken(user.id);
    const res = NextResponse.json({ ok: true, userId: user.id });
    res.cookies.set(COOKIE_NAME, token, cookieOptions);
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Signup failed' }, { status: 400 });
  }
}
