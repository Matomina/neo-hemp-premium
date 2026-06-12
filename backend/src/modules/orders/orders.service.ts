import { prisma } from '../../config/prisma';
import { generateOrderNumber } from '../../utils/orderNumber';
import type { z } from 'zod';
import type { DraftOrderSchema } from './orders.schemas';

export async function createDraftOrder(data: z.infer<typeof DraftOrderSchema>) {
  const totalCents = data.items.reduce((s, i) => s + Math.round(i.price * 100) * i.quantity, 0);
  return prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      totalCents,
      adultConfirmed: data.adultConfirmed,
      termsAccepted: data.termsAccepted,
      status: 'DRAFT',
      paymentStatus: 'NOT_STARTED',
      items: {
        create: data.items.map(i => ({
          name: i.name,
          quantity: i.quantity,
          unitCents: Math.round(i.price * 100),
          totalCents: Math.round(i.price * 100) * i.quantity,
        })),
      },
    },
    include: { items: true },
  });
}

export async function confirmOrder(id: string) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return null;
  if (order.status !== 'DRAFT') throw new Error('Order already processed');
  return prisma.order.update({
    where: { id },
    data: { status: 'CONFIRMED' },
    include: { items: true },
  });
}
