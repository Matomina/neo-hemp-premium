import { prisma } from '../../config/prisma';
import type { z } from 'zod';
import type { ProductQuerySchema } from './products.schemas';

export async function getProducts(query: z.infer<typeof ProductQuerySchema>) {
  const { category, search, page, limit } = query;
  const where = {
    isActive: true,
    isSellable: true,
    launchStatus: 'ACTIVE' as const,
    ...(category ? { category: category.toUpperCase() as never } : {}),
    ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' as const } }, { shortDescription: { contains: search, mode: 'insensitive' as const } }] } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: [{ popularityScore: 'desc' }, { createdAt: 'desc' }] }),
    prisma.product.count({ where }),
  ]);
  return { items, total, page, limit, pages: Math.ceil(total / limit) };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug }, include: { certificates: true } });
}
