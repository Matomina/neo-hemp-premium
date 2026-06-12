import { prisma } from '../../config/prisma';

export async function generateInvoiceNumber(type: 'Q' | 'F'): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = type === 'Q' ? 'DEV' : 'FAC';

  const count = await prisma.invoice.count({
    where: {
      invoiceNumber: { startsWith: `${prefix}-${year}-` },
    },
  });

  const seq = String(count + 1).padStart(4, '0');
  return `${prefix}-${year}-${seq}`;
}

export function generatePublicRef(prefix: 'CBD-DEV' | 'CBD-CMD'): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${date}-${rand}`;
}
