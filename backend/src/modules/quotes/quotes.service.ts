import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { generatePublicRef } from '../../services/invoiceNumber/invoiceNumberService';
import type { CreateQuoteInput } from './quotes.schema';

export async function createQuoteRequest(input: CreateQuoteInput) {
  const publicRef = generatePublicRef('CBD-DEV');
  const subtotalCents = input.items.reduce((s, i) => s + i.totalCents, 0);
  const totalCents = subtotalCents + (input.shippingCents ?? 0) + (input.taxCents ?? 0);

  return prisma.quoteRequest.create({
    data: {
      publicRef,
      customerSnapshot: {
        name: input.customerName,
        email: input.customerEmail,
        phone: input.customerPhone,
      },
      clientMessage: input.clientMessage,
      simulatorPayload: (input.simulatorPayload ?? {}) as Prisma.InputJsonValue,
      items: input.items as unknown as Prisma.InputJsonValue,
      subtotalCents,
      shippingCents: input.shippingCents ?? 0,
      taxCents: input.taxCents ?? 0,
      totalCents,
    },
  });
}

export async function listQuotes(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.quoteRequest.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.quoteRequest.count(),
  ]);
  return { items, total, page, limit };
}

export async function getQuote(id: string) {
  return prisma.quoteRequest.findUnique({
    where: { id },
    include: {
      invoices: true,
      payments: true,
      emails: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });
}

export async function updateQuote(id: string, data: Partial<{
  adminNotes: string;
  totalCents: number;
  shippingCents: number;
  taxCents: number;
  status: string;
}>) {
  return prisma.quoteRequest.update({ where: { id }, data: data as Parameters<typeof prisma.quoteRequest.update>[0]['data'] });
}
