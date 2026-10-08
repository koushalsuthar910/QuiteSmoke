import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const count = await prisma.cigaretteProduct.count();
    const products = await prisma.cigaretteProduct.findMany({
      select: { id: true, brand: true, productName: true },
      take: 20,
    });
    return NextResponse.json({ count, products });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}