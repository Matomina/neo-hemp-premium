import type { Request, Response } from 'express';
import { createQuoteRequest, listQuotes, getQuote, updateQuote } from './quotes.service';
import { CreateQuoteSchema, AdminUpdateQuoteSchema } from './quotes.schema';
import { sendEmail, tplQuoteRequestClient, tplQuoteRequestAdmin, tplQuoteApprovedClient } from '../../services/email/emailService';
import { generateInvoicePdf } from '../../services/pdf/invoicePdfService';
import { createCheckoutSession } from '../../services/stripe/stripeService';
import { generateInvoiceNumber } from '../../services/invoiceNumber/invoiceNumberService';
import { logAudit } from '../../services/auditLog/auditLogService';
import { prisma } from '../../config/prisma';
import { ENV } from '../../config/env';
import { logger } from '../../utils/logger';

const ADMIN_URL = `${ENV.FRONTEND_ORIGINS[0]}/admin/devis`;
const ADMIN_EMAIL_TO = ENV.ADMIN_EMAIL || 'admin@culturebiodiamant.fr';

// POST /api/quotes
export async function createQuote(req: Request, res: Response): Promise<void> {
  const parsed = CreateQuoteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation error', issues: parsed.error.issues });
    return;
  }

  const quote = await createQuoteRequest(parsed.data);

  // Emails async — ne bloque pas la réponse
  const snapshot = quote.customerSnapshot as { name: string; email: string };
  void sendEmail({
    type: 'QUOTE_REQUEST_CLIENT',
    to: snapshot.email,
    ...tplQuoteRequestClient({ ref: quote.publicRef, customerName: snapshot.name, totalCents: quote.totalCents }),
    quoteId: quote.id,
  });
  void sendEmail({
    type: 'QUOTE_REQUEST_ADMIN',
    to: ADMIN_EMAIL_TO,
    ...tplQuoteRequestAdmin({ ref: quote.publicRef, customerName: snapshot.name, customerEmail: snapshot.email, totalCents: quote.totalCents, adminUrl: `${ADMIN_URL}/${quote.id}` }),
    quoteId: quote.id,
  });

  res.status(201).json({ id: quote.id, publicRef: quote.publicRef, totalCents: quote.totalCents });
}

// GET /api/admin/quotes
export async function adminListQuotes(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(String(req.query['page'] ?? '1'), 10));
  const limit = Math.min(50, Math.max(1, parseInt(String(req.query['limit'] ?? '20'), 10)));
  const result = await listQuotes(page, limit);
  res.json(result);
}

// GET /api/admin/quotes/:id
export async function adminGetQuote(req: Request, res: Response): Promise<void> {
  const quote = await getQuote(String(req.params['id']));
  if (!quote) { res.status(404).json({ error: 'Quote not found' }); return; }
  res.json(quote);
}

// PATCH /api/admin/quotes/:id
export async function adminUpdateQuote(req: Request, res: Response): Promise<void> {
  const parsed = AdminUpdateQuoteSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Validation error', issues: parsed.error.issues }); return; }

  const quote = await updateQuote(String(req.params['id']), parsed.data);
  res.json(quote);
}

// POST /api/admin/quotes/:id/approve
export async function adminApproveQuote(req: Request, res: Response): Promise<void> {
  const id = String(req.params['id']);
  const quote = await getQuote(id);
  if (!quote) { res.status(404).json({ error: 'Quote not found' }); return; }

  const snapshot = quote.customerSnapshot as { name: string; email: string };
  const items = quote.items as Array<{ name: string; quantity: number; unitCents: number; totalCents: number }>;

  // Generate invoice
  const invoiceNumber = await generateInvoiceNumber('Q');
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      type: 'QUOTE',
      quoteId: quote.id,
      status: 'ISSUED',
      amountCents: quote.totalCents,
      issuedAt: new Date(),
    },
  });

  let pdfPath: string | undefined;
  try {
    const pdfResult = await generateInvoicePdf({
      invoiceNumber,
      type: 'QUOTE',
      status: 'ISSUED',
      issuedAt: new Date(),
      customerName: snapshot.name,
      customerEmail: snapshot.email,
      items,
      subtotalCents: quote.subtotalCents,
      shippingCents: quote.shippingCents,
      taxCents: quote.taxCents,
      totalCents: quote.totalCents,
      adminNotes: quote.adminNotes ?? undefined,
      publicRef: quote.publicRef,
    });
    pdfPath = pdfResult.pdfPath;
    await prisma.invoice.update({ where: { id: invoice.id }, data: { pdfPath } });
  } catch (err) {
    logger.error('[QUOTE APPROVE] PDF generation failed', err);
  }

  await updateQuote(id, { status: 'APPROVED' });
  await prisma.quoteRequest.update({ where: { id }, data: { approvedAt: new Date() } });
  await logAudit({ actorId: req.adminUser?.sub, action: 'QUOTE_APPROVED', entityType: 'QuoteRequest', entityId: id });

  res.json({ ok: true, invoiceId: invoice.id, invoiceNumber, pdfPath });
}

// POST /api/admin/quotes/:id/send-payment
export async function adminSendQuotePayment(req: Request, res: Response): Promise<void> {
  const id = String(req.params['id']);
  const quote = await getQuote(id);
  if (!quote) { res.status(404).json({ error: 'Quote not found' }); return; }

  const snapshot = quote.customerSnapshot as { name: string; email: string };
  const idempotencyKey = `quote-${quote.id}`;

  try {
    const session = await createCheckoutSession({
      idempotencyKey,
      customerEmail: snapshot.email,
      amountCents: quote.totalCents,
      description: `Devis CBD ${quote.publicRef} — Culture Bio Diamant`,
      metadata: { quoteId: quote.id, publicRef: quote.publicRef },
    });

    const payment = await prisma.payment.create({
      data: {
        type: 'QUOTE',
        quoteId: quote.id,
        stripeCheckoutSessionId: session.sessionId,
        stripePaymentIntentId: session.paymentIntentId,
        checkoutUrl: session.checkoutUrl,
        amountCents: quote.totalCents,
        idempotencyKey,
        status: 'CREATED',
      },
    });

    await updateQuote(id, { status: 'PAYMENT_SENT' });
    await prisma.quoteRequest.update({ where: { id }, data: { paymentSentAt: new Date() } });

    // Email client avec lien paiement
    const latestInvoice = quote.invoices[0];
    void sendEmail({
      type: 'QUOTE_APPROVED_CLIENT',
      to: snapshot.email,
      ...tplQuoteApprovedClient({ ref: quote.publicRef, customerName: snapshot.name, totalCents: quote.totalCents, paymentUrl: session.checkoutUrl }),
      quoteId: quote.id,
      attachments: latestInvoice?.pdfPath ? [{ filename: `Devis-${quote.publicRef}.pdf`, path: latestInvoice.pdfPath }] : undefined,
    });

    await logAudit({ actorId: req.adminUser?.sub, action: 'QUOTE_PAYMENT_SENT', entityType: 'QuoteRequest', entityId: id });
    res.json({ ok: true, paymentId: payment.id, checkoutUrl: session.checkoutUrl });
  } catch (err) {
    logger.error('[QUOTE PAYMENT] Error', err);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
}

// POST /api/admin/quotes/:id/cancel
export async function adminCancelQuote(req: Request, res: Response): Promise<void> {
  const id = String(req.params['id']);
  await updateQuote(id, { status: 'CANCELLED' });
  await logAudit({ actorId: req.adminUser?.sub, action: 'QUOTE_CANCELLED', entityType: 'QuoteRequest', entityId: id });
  res.json({ ok: true });
}
