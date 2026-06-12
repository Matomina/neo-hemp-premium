import { prisma } from '../../config/prisma';
import { generatePublicRef } from '../../services/invoiceNumber/invoiceNumberService';
import type { z } from 'zod';
import type { DraftOrderSchema } from './orders.schemas';

export async function createDraftOrder(data: z.infer<typeof DraftOrderSchema>) {
  const subtotalCents = data.items.reduce((s, i) => s + Math.round(i.price * 100) * i.quantity, 0);
  const totalCents = subtotalCents;
  const publicRef = generatePublicRef('CBD-CMD');

  const customerSnapshot = {
    name: data.customerName,
    email: data.customerEmail,
    phone: data.customerPhone,
    address: {
      line1: data.addressLine1,
      line2: data.addressLine2,
      postalCode: data.postalCode,
      city: data.city,
      country: data.country,
    },
  };

  return prisma.order.create({
    data: {
      publicRef,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerSnapshot,
      subtotalCents,
      totalCents,
      adultConfirmed: data.adultConfirmed,
      termsAccepted: data.termsAccepted,
      status: 'CART_SUBMITTED',
      items: data.items,
      orderItems: {
        create: data.items.map(i => ({
          name: i.name,
          quantity: i.quantity,
          unitCents: Math.round(i.price * 100),
          totalCents: Math.round(i.price * 100) * i.quantity,
        })),
      },
    },
    include: { orderItems: true },
  });
}

export async function confirmOrder(id: string) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return null;
  return prisma.order.update({
    where: { id },
    data: { status: 'PENDING_ADMIN_REVIEW' },
    include: { orderItems: true },
  });
}

export async function listOrders(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { orderItems: true },
    }),
    prisma.order.count(),
  ]);
  return { items, total, page, limit };
}

export async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: true,
      invoices: true,
      payments: true,
      emails: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });
}
