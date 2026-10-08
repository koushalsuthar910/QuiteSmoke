import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const products = await prisma.cigaretteProduct.findMany({ orderBy: [{ brand: 'asc' }, { productName: 'asc' }] });
  return NextResponse.json(products);
}
