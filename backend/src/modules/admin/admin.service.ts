import { prisma } from '../../config/prisma';

export async function listAdminOrders() {
  return prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } });
}

export async function updateOrderStatus(id: string, status: string) {
  return prisma.order.update({ where: { id }, data: { status: status as never } });
}

export async function listContactMessages() {
  return prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function markContactRead(id: string) {
  return prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
}
