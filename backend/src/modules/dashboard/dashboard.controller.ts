import type { Request, Response } from 'express';
import { prisma } from '../../config/prisma';

// GET /api/admin/dashboard/summary
export async function getDashboardSummary(_req: Request, res: Response): Promise<void> {
  const [
    ordersCount,
    ordersPendingCount,
    ordersRevenueResult,
    quotesCount,
    quotesPendingCount,
    contactsCount,
    contactsUnreadCount,
    invoicesCount,
    invoicesPaidCount,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ['CART_SUBMITTED', 'PENDING_ADMIN_REVIEW'] } } }),
    prisma.order.aggregate({ where: { status: 'PAID' }, _sum: { totalCents: true } }),
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({ where: { status: 'NEW' } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.invoice.count(),
    prisma.invoice.count({ where: { status: 'PAID' } }),
  ]);

  res.json({
    orders: {
      total: ordersCount,
      pending: ordersPendingCount,
      revenueCents: ordersRevenueResult._sum.totalCents ?? 0,
    },
    quotes: {
      total: quotesCount,
      pending: quotesPendingCount,
    },
    contacts: {
      total: contactsCount,
      unread: contactsUnreadCount,
    },
    invoices: {
      total: invoicesCount,
      paid: invoicesPaidCount,
    },
  });
}

// GET /api/admin/dashboard/activity
export async function getDashboardActivity(_req: Request, res: Response): Promise<void> {
  const [recentOrders, recentQuotes, recentContacts, recentAuditLogs] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, publicRef: true, customerName: true, totalCents: true, status: true, createdAt: true },
    }),
    prisma.quoteRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, publicRef: true, customerSnapshot: true, totalCents: true, status: true, createdAt: true },
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, subject: true, isRead: true, createdAt: true },
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, action: true, entityType: true, entityId: true, createdAt: true },
    }),
  ]);

  res.json({ recentOrders, recentQuotes, recentContacts, recentAuditLogs });
}
