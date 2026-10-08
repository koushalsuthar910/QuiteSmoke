import { cookies } from 'next/headers';
import { verifyToken, COOKIE_NAME } from './auth';
import { prisma } from './prisma';

export async function getCurrentUser() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  const uid = await verifyToken(token);
  if (!uid) return null;
  return prisma.user.findUnique({ where: { id: uid }, include: { profile: true } });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}
