import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../../config/prisma';

type InvoiceNumberClient = PrismaClient | Prisma.TransactionClient;

export async function generateInvoiceNumber(
  type: 'Q' | 'F',
  db: InvoiceNumberClient = prisma,
  issuedAt = new Date(),
): Promise<string> {
  const year = issuedAt.getFullYear();
  const prefix = type === 'Q' ? 'DEV' : 'FAC';
  const scope = `${prefix}-${year}`;
  const sequence = await db.invoiceSequence.upsert({
    where: { scope },
    create: { scope, value: 1 },
    update: { value: { increment: 1 } },
    select: { value: true },
  });
  const seq = String(sequence.value).padStart(4, '0');
  return `${prefix}-${year}-${seq}`;
}

export function generatePublicRef(prefix: 'CBD-DEV' | 'CBD-CMD'): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${date}-${rand}`;
}
