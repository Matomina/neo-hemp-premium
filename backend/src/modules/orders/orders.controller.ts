import type { Request, RequestHandler, Response } from 'express';
import { DraftOrderSchema } from './orders.schemas';
import { confirmOrder, createDraftOrder, getOrder, listOrders } from './orders.service';
import { sendEmail, tplOrderSubmittedClient, tplOrderSubmittedAdmin, tplOrderApprovedClient, tplOrderPaidClient } from '../../services/email/emailService';
import { generateInvoicePdf } from '../../services/pdf/invoicePdfService';
import { createCheckoutSession } from '../../services/stripe/stripeService';
import { generateInvoiceNumber } from '../../services/invoiceNumber/invoiceNumberService';
import { logAudit } from '../../services/auditLog/auditLogService';
import { prisma } from '../../config/prisma';
import { ENV } from '../../config/env';
import { logger } from '../../utils/logger';
import { z } from 'zod';

const ADMIN_URL = `${ENV.APP_PUBLIC_URL}/admin/commandes`;
const ADMIN_EMAIL_TO = ENV.ADMIN_EMAIL || 'admin@culturebiodiamant.fr';

// POST /api/orders
export const submitOrder: RequestHandler = async (req, res, next) => {
  try {
    const data = DraftOrderSchema.parse(req.body);
    const order = await createDraftOrder(data);

    // Confirm immediately → PENDING_ADMIN_REVIEW
    await confirmOrder(order.id);

    void sendEmail({
      type: 'ORDER_SUBMITTED_CLIENT',
      to: order.customerEmail,
      ...tplOrderSubmittedClient({ ref: order.publicRef, customerName: order.customerName, totalCents: order.totalCents }),
      orderId: order.id,
    });
    void sendEmail({
      type: 'ORDER_SUBMITTED_ADMIN',
      to: ADMIN_EMAIL_TO,
      ...tplOrderSubmittedAdmin({ ref: order.publicRef, customerName: order.customerName, customerEmail: order.customerEmail, totalCents: order.totalCents, adminUrl: `${ADMIN_URL}/${order.id}` }),
      orderId: order.id,
    });

    res.status(201).json({
      id: order.id,
      publicRef: order.publicRef,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      status: 'PENDING_ADMIN_REVIEW',
      subtotalCents: order.subtotalCents,
      shippingCents: order.shippingCents,
      totalCents: order.totalCents,
    });
  } catch (err) { next(err); }
};

// POST /api/orders/draft (legacy compat)
export const draftOrder: RequestHandler = async (req, res, next) => {
  try {
    const data = DraftOrderSchema.parse(req.body);
    const order = await createDraftOrder(data);
    res.status(201).json({
      id: order.id,
      publicRef: order.publicRef,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      status: order.status,
      subtotalCents: order.subtotalCents,
      shippingCents: order.shippingCents,
      totalCents: order.totalCents,
    });
  } catch (err) { next(err); }
};

// POST /api/orders/:id/confirm (legacy compat)
export const confirmOrderHandler: RequestHandler = async (req, res, next) => {
  try {
    const order = await confirmOrder(String(req.params['id']));
    if (!order) { res.status(404).json({ error: 'Order not found' }); return; }
    res.json({ id: order.id, publicRef: order.publicRef, status: order.status });
  } catch (err) { next(err); }
};

// GET /api/admin/orders
export async function adminListOrders(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(String(req.query['page'] ?? '1'), 10));
  const limit = Math.min(50, Math.max(1, parseInt(String(req.query['limit'] ?? '20'), 10)));
  const result = await listOrders(page, limit);
  res.json(result);
}

// GET /api/admin/orders/:id
export async function adminGetOrder(req: Request, res: Response): Promise<void> {
  const order = await getOrder(String(req.params['id']));
  if (!order) { res.status(404).json({ error: 'Order not found' }); return; }
  res.json(order);
}

// PATCH /api/admin/orders/:id
export async function adminUpdateOrder(req: Request, res: Response): Promise<void> {
  const UpdateSchema = z.object({
    adminNotes: z.string().optional(),
    shippingCents: z.number().int().min(0).optional(),
    status: z.enum(['CART_SUBMITTED', 'PENDING_ADMIN_REVIEW', 'APPROVED', 'PAYMENT_SENT', 'PAID', 'CANCELLED', 'REFUNDED', 'EXPIRED']).optional(),
  });
  const parsed = UpdateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Validation error', issues: parsed.error.issues }); return; }

  const orderId = String(req.params['id']);
  const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });
  if (!existingOrder) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  const data: Parameters<typeof prisma.order.update>[0]['data'] = { ...parsed.data };
  if (typeof parsed.data.shippingCents === 'number') {
    data.totalCents = existingOrder.subtotalCents + existingOrder.taxCents + parsed.data.shippingCents;
  }

  const updated = await prisma.order.update({ where: { id: orderId }, data });
  res.json(updated);
}

// POST /api/admin/orders/:id/approve
export async function adminApproveOrder(req: Request, res: Response): Promise<void> {
  const id = String(req.params['id']);
  const order = await getOrder(id);
  if (!order) { res.status(404).json({ error: 'Order not found' }); return; }

  const items = order.orderItems.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    unitCents: item.unitCents,
    totalCents: item.totalCents,
  }));
  const issuedAt = new Date();
  const { invoice, invoiceNumber } = await prisma.$transaction(async (tx) => {
    const nextInvoiceNumber = await generateInvoiceNumber('F', tx, issuedAt);
    const createdInvoice = await tx.invoice.create({
      data: {
        invoiceNumber: nextInvoiceNumber,
        type: 'ORDER',
        orderId: order.id,
        status: 'ISSUED',
        amountCents: order.totalCents,
        issuedAt,
      },
    });
    await tx.order.update({ where: { id }, data: { status: 'APPROVED', approvedAt: issuedAt } });

    return { invoice: createdInvoice, invoiceNumber: nextInvoiceNumber };
  });

  let pdfPath: string | undefined;
  try {
    const pdfResult = await generateInvoicePdf({
      invoiceNumber,
      type: 'ORDER',
      status: 'ISSUED',
      issuedAt,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items,
      subtotalCents: order.subtotalCents,
      shippingCents: order.shippingCents,
      taxCents: order.taxCents,
      totalCents: order.totalCents,
      adminNotes: order.adminNotes ?? undefined,
      publicRef: order.publicRef,
    });
    pdfPath = pdfResult.pdfPath;
    await prisma.invoice.update({ where: { id: invoice.id }, data: { pdfPath } });
  } catch (err) {
    logger.error('[ORDER APPROVE] PDF generation failed', err);
  }
  await logAudit({ actorId: req.adminUser?.sub, action: 'ORDER_APPROVED', entityType: 'Order', entityId: id });

  res.json({ ok: true, invoiceId: invoice.id, invoiceNumber, pdfPath });
}

// POST /api/admin/orders/:id/send-payment
export async function adminSendOrderPayment(req: Request, res: Response): Promise<void> {
  const id = String(req.params['id']);
  const order = await getOrder(id);
  if (!order) { res.status(404).json({ error: 'Order not found' }); return; }
  const existingPayment = await prisma.payment.findFirst({
    where: {
      orderId: order.id,
      status: { in: ['CREATED', 'PENDING', 'PAID'] },
    },
    orderBy: { createdAt: 'desc' },
  });
  if (existingPayment?.status === 'PAID') {
    res.json({ ok: true, paymentId: existingPayment.id, checkoutUrl: existingPayment.checkoutUrl, alreadyPaid: true });
    return;
  }
  if (existingPayment && existingPayment.checkoutUrl) {
    res.json({ ok: true, paymentId: existingPayment.id, checkoutUrl: existingPayment.checkoutUrl, reused: true });
    return;
  }

  const idempotencyKey = `order-${order.id}-${Date.now()}`;

  try {
    const session = await createCheckoutSession({
      idempotencyKey,
      customerEmail: order.customerEmail,
      amountCents: order.totalCents,
      description: `Commande CBD ${order.publicRef} — Culture Bio Diamant`,
      metadata: { orderId: order.id, publicRef: order.publicRef },
    });

    const payment = await prisma.payment.create({
      data: {
        type: 'ORDER',
        orderId: order.id,
        invoiceId: order.invoices[0]?.id,
        stripeCheckoutSessionId: session.sessionId,
        stripePaymentIntentId: session.paymentIntentId,
        checkoutUrl: session.checkoutUrl,
        amountCents: order.totalCents,
        idempotencyKey,
        status: 'CREATED',
      },
    });

    await prisma.order.update({ where: { id }, data: { status: 'PAYMENT_SENT', paymentSentAt: new Date() } });

    const latestInvoice = order.invoices[0];
    void sendEmail({
      type: 'ORDER_APPROVED_CLIENT',
      to: order.customerEmail,
      ...tplOrderApprovedClient({ ref: order.publicRef, customerName: order.customerName, totalCents: order.totalCents, paymentUrl: session.checkoutUrl }),
      orderId: order.id,
      attachments: latestInvoice?.pdfPath ? [{ filename: `Commande-${order.publicRef}.pdf`, path: latestInvoice.pdfPath }] : undefined,
    });

    await logAudit({ actorId: req.adminUser?.sub, action: 'ORDER_PAYMENT_SENT', entityType: 'Order', entityId: id });
    res.json({ ok: true, paymentId: payment.id, checkoutUrl: session.checkoutUrl });
  } catch (err) {
    logger.error('[ORDER PAYMENT] Error', err);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
}

// POST /api/admin/orders/:id/cancel
export async function adminCancelOrder(req: Request, res: Response): Promise<void> {
  const id = String(req.params['id']);
  await prisma.order.update({ where: { id }, data: { status: 'CANCELLED' } });
  await logAudit({ actorId: req.adminUser?.sub, action: 'ORDER_CANCELLED', entityType: 'Order', entityId: id });
  res.json({ ok: true });
}

// Notify confirmed paid order (called from webhook)
export async function markOrderPaid(orderId: string): Promise<void> {
  const order = await getOrder(orderId);
  if (!order) return;

  await prisma.order.update({ where: { id: orderId }, data: { status: 'PAID', paidAt: new Date() } });
  await prisma.invoice.updateMany({ where: { orderId }, data: { status: 'PAID', paidAt: new Date() } });

  void sendEmail({
    type: 'ORDER_PAID_CLIENT',
    to: order.customerEmail,
    ...tplOrderPaidClient({ ref: order.publicRef, customerName: order.customerName, totalCents: order.totalCents }),
    orderId: order.id,
    attachments: order.invoices[0]?.pdfPath ? [{ filename: `Facture-${order.publicRef}.pdf`, path: order.invoices[0].pdfPath }] : undefined,
  });
}
