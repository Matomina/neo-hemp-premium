import type { Request, Response } from 'express';
import { verifyWebhookSignature, isStripeEnabled } from '../../services/stripe/stripeService';
import { markOrderPaid } from '../orders/orders.controller';
import { prisma } from '../../config/prisma';
import { logger } from '../../utils/logger';
import { logAudit } from '../../services/auditLog/auditLogService';
import { sendEmail, tplQuotePaidClient } from '../../services/email/emailService';

// POST /api/stripe/webhook
export async function stripeWebhook(req: Request, res: Response): Promise<void> {
  if (!isStripeEnabled()) {
    res.json({ received: true, mock: true });
    return;
  }

  const sig = req.headers['stripe-signature'];
  if (!sig || !req.rawBody) {
    res.status(400).json({ error: 'Missing signature or body' });
    return;
  }

  let event;
  try {
    event = verifyWebhookSignature(req.rawBody, String(sig));
  } catch (err) {
    logger.error('[WEBHOOK] Signature verification failed', err);
    res.status(400).json({ error: 'Invalid signature' });
    return;
  }

  logger.info(`[WEBHOOK] Event: ${event.type}`);

  // Respond quickly — process async
  res.json({ received: true });

  void processWebhookEvent(event as unknown as { type: string; data: { object: Record<string, unknown> } });
}

async function processWebhookEvent(event: { type: string; data: { object: Record<string, unknown> } }): Promise<void> {
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const sessionId = String(session['id'] ?? '');
        await handleSessionCompleted(sessionId);
        break;
      }
      case 'payment_intent.succeeded': {
        const intent = event.data.object;
        logger.info(`[WEBHOOK] PaymentIntent succeeded: ${intent['id']}`);
        break;
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data.object;
        await handlePaymentFailed(String(intent['id'] ?? ''));
        break;
      }
      case 'checkout.session.expired': {
        const session = event.data.object;
        await handleSessionExpired(String(session['id'] ?? ''));
        break;
      }
      default:
        logger.info(`[WEBHOOK] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    logger.error('[WEBHOOK] Error processing event', err);
  }
}

async function handleSessionCompleted(sessionId: string): Promise<void> {
  const payment = await prisma.payment.findUnique({ where: { stripeCheckoutSessionId: sessionId } });
  if (!payment) { logger.warn(`[WEBHOOK] No payment found for session ${sessionId}`); return; }

  // Idempotency: already paid
  if (payment.status === 'PAID') { logger.info(`[WEBHOOK] Payment ${payment.id} already paid — skip`); return; }

  await prisma.payment.update({ where: { id: payment.id }, data: { status: 'PAID' } });
  await logAudit({ action: 'STRIPE_PAYMENT_COMPLETED', entityType: 'Payment', entityId: payment.id, metadata: { sessionId } });

  if (payment.type === 'ORDER' && payment.orderId) {
    await markOrderPaid(payment.orderId);
  } else if (payment.type === 'QUOTE' && payment.quoteId) {
    await handleQuotePaid(payment.quoteId);
  }
}

async function handleQuotePaid(quoteId: string): Promise<void> {
  const quote = await prisma.quoteRequest.findUnique({
    where: { id: quoteId },
    include: { invoices: true },
  });
  if (!quote) return;

  await prisma.quoteRequest.update({ where: { id: quoteId }, data: { status: 'PAID', paidAt: new Date() } });
  await prisma.invoice.updateMany({ where: { quoteId }, data: { status: 'PAID', paidAt: new Date() } });

  const snapshot = quote.customerSnapshot as { name: string; email: string };
  void sendEmail({
    type: 'QUOTE_PAID_CLIENT',
    to: snapshot.email,
    ...tplQuotePaidClient({ ref: quote.publicRef, customerName: snapshot.name, totalCents: quote.totalCents }),
    quoteId: quote.id,
    attachments: quote.invoices[0]?.pdfPath ? [{ filename: `Facture-${quote.publicRef}.pdf`, path: quote.invoices[0].pdfPath }] : undefined,
  });
}

async function handlePaymentFailed(paymentIntentId: string): Promise<void> {
  await prisma.payment.updateMany({ where: { stripePaymentIntentId: paymentIntentId }, data: { status: 'FAILED' } });
  logger.warn(`[WEBHOOK] PaymentIntent failed: ${paymentIntentId}`);
}

async function handleSessionExpired(sessionId: string): Promise<void> {
  await prisma.payment.updateMany({ where: { stripeCheckoutSessionId: sessionId }, data: { status: 'EXPIRED' } });
  logger.info(`[WEBHOOK] Checkout session expired: ${sessionId}`);
}

// GET /api/admin/payments
export async function adminListPayments(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(String(req.query['page'] ?? '1'), 10));
  const limit = Math.min(50, parseInt(String(req.query['limit'] ?? '20'), 10));
  const [items, total] = await Promise.all([
    prisma.payment.findMany({ orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.payment.count(),
  ]);
  res.json({ items, total, page, limit });
}

// GET /api/admin/payments/:id
export async function adminGetPayment(req: Request, res: Response): Promise<void> {
  const payment = await prisma.payment.findUnique({ where: { id: String(req.params['id']) } });
  if (!payment) { res.status(404).json({ error: 'Payment not found' }); return; }
  res.json(payment);
}
