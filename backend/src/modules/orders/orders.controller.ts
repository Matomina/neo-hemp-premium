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

const ADMIN_URL = `${ENV.FRONTEND_ORIGINS[0]}/admin/commandes`;
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

    res.status(201).json({ id: order.id, publicRef: order.publicRef, totalCents: order.totalCents });
  } catch (err) { next(err); }
};

// POST /api/orders/draft (legacy compat)
export const draftOrder: RequestHandler = async (req, res, next) => {
  try {
    const data = DraftOrderSchema.parse(req.body);
    const order = await createDraftOrder(data);
    res.status(201).json({ id: order.id, publicRef: order.publicRef, totalCents: order.totalCents });
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

  const updated = await prisma.order.update({ where: { id: String(req.params['id']) }, data: parsed.data as Parameters<typeof prisma.order.update>[0]['data'] });
  res.json(updated);
}

// POST /api/admin/orders/:id/approve
export async function adminApproveOrder(req: Request, res: Response): Promise<void> {
  const id = String(req.params['id']);
  const order = await getOrder(id);
  if (!order) { res.status(404).json({ error: 'Order not found' }); return; }

  const items = (order.items ?? []) as Array<{ name: string; quantity: number; unitCents: number; totalCents: number }>;
  const invoiceNumber = await generateInvoiceNumber('F');

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      type: 'ORDER',
      orderId: order.id,
      status: 'ISSUED',
      amountCents: order.totalCents,
      issuedAt: new Date(),
    },
  });

  let pdfPath: string | undefined;
  try {
    const pdfResult = await generateInvoicePdf({
      invoiceNumber,
      type: 'ORDER',
      status: 'ISSUED',
      issuedAt: new Date(),
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

  await prisma.order.update({ where: { id }, data: { status: 'APPROVED', approvedAt: new Date() } });
  await logAudit({ actorId: req.adminUser?.sub, action: 'ORDER_APPROVED', entityType: 'Order', entityId: id });

  res.json({ ok: true, invoiceId: invoice.id, invoiceNumber, pdfPath });
}

// POST /api/admin/orders/:id/send-payment
export async function adminSendOrderPayment(req: Request, res: Response): Promise<void> {
  const id = String(req.params['id']);
  const order = await getOrder(id);
  if (!order) { res.status(404).json({ error: 'Order not found' }); return; }

  const idempotencyKey = `order-${order.id}`;

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
