import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const PRODUCTS = [
  { brand: 'Gold Flake',    productName: 'Kings',    nicotine_mg: 1.1, tar_mg: 14, carbon_monoxide_mg: 13, packPrice: 240, cigarettesPerPack: 10 },
  { brand: 'Gold Flake',    productName: 'Lights',   nicotine_mg: 0.8, tar_mg: 10, carbon_monoxide_mg: 10, packPrice: 225, cigarettesPerPack: 10 },
  { brand: 'Classic',       productName: 'Regular',  nicotine_mg: 1.1, tar_mg: 14, carbon_monoxide_mg: 13, packPrice: 480, cigarettesPerPack: 20 },
  { brand: 'Classic',       productName: 'Milds',    nicotine_mg: 0.9, tar_mg: 11, carbon_monoxide_mg: 11, packPrice: 480, cigarettesPerPack: 20 },
  { brand: 'Wills',         productName: 'Navy Cut', nicotine_mg: 1.0, tar_mg: 13, carbon_monoxide_mg: 12, packPrice: 120, cigarettesPerPack: 10 },
  { brand: 'Four Square',   productName: 'Regular',  nicotine_mg: 1.0, tar_mg: 13, carbon_monoxide_mg: 12, packPrice: 130, cigarettesPerPack: 10 },
  { brand: 'Marlboro',      productName: 'Compact',  nicotine_mg: 0.8, tar_mg: 10, carbon_monoxide_mg: 10, packPrice: 115, cigarettesPerPack: 10 },
  { brand: 'Choti Advance', productName: 'Small',    nicotine_mg: 0.9, tar_mg: 11, carbon_monoxide_mg: 10, packPrice:  90, cigarettesPerPack: 10 },
];

async function main() {
  for (const p of PRODUCTS) {
    const exists = await prisma.cigaretteProduct.findFirst({ where: { brand: p.brand, productName: p.productName } });
    if (!exists) await prisma.cigaretteProduct.create({ data: { ...p, source: 'seed-2026', isEstimated: true } });
  }
  console.log('Seeded', PRODUCTS.length, 'products');
}
main().finally(() => prisma.$disconnect());
