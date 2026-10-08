import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me');
const PROTECTED = ['/dashboard', '/money', '/history', '/profile', '/onboarding'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = PROTECTED.some(p => pathname.startsWith(p));
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  const token = req.cookies.get('qt_session')?.value;
  let valid = false;
  if (token) {
    try { await jwtVerify(token, SECRET); valid = true; } catch {}
  }

  if (needsAuth && !valid) return NextResponse.redirect(new URL('/login', req.url));
  if (isAuthPage && valid) return NextResponse.redirect(new URL('/dashboard', req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/money/:path*', '/history/:path*', '/profile/:path*', '/onboarding', '/login', '/signup'],
};
