import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { prisma } from '../../config/prisma';
import { generateInvoicePdf } from '../../services/pdf/invoicePdfService';
import { logger } from '../../utils/logger';

// GET /api/admin/invoices
export async function adminListInvoices(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(String(req.query['page'] ?? '1'), 10));
  const limit = Math.min(50, parseInt(String(req.query['limit'] ?? '20'), 10));
  const [items, total] = await Promise.all([
    prisma.invoice.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { customer: true },
    }),
    prisma.invoice.count(),
  ]);
  res.json({ items, total, page, limit });
}

// GET /api/admin/invoices/:id
export async function adminGetInvoice(req: Request, res: Response): Promise<void> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: String(req.params['id']) },
    include: { quote: true, order: { include: { orderItems: true } } },
  });
  if (!invoice) { res.status(404).json({ error: 'Invoice not found' }); return; }
  res.json(invoice);
}

// GET /api/admin/invoices/:id/pdf
export async function adminDownloadInvoicePdf(req: Request, res: Response): Promise<void> {
  const invoice = await prisma.invoice.findUnique({ where: { id: String(req.params['id']) } });
  if (!invoice) { res.status(404).json({ error: 'Invoice not found' }); return; }
  if (!invoice.pdfPath || !fs.existsSync(invoice.pdfPath)) {
    res.status(404).json({ error: 'PDF not yet generated' });
    return;
  }
  const filename = path.basename(invoice.pdfPath);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  fs.createReadStream(invoice.pdfPath).pipe(res);
}

// POST /api/admin/invoices/:id/regenerate-pdf
export async function adminRegeneratePdf(req: Request, res: Response): Promise<void> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: String(req.params['id']) },
    include: {
      quote: true,
      order: { include: { orderItems: true } },
    },
  });
  if (!invoice) { res.status(404).json({ error: 'Invoice not found' }); return; }

  try {
    let customerName = 'Client';
    let customerEmail = '';
    let items: Array<{ name: string; quantity: number; unitCents: number; totalCents: number }> = [];
    let subtotalCents = 0;
    let shippingCents = 0;
    let taxCents = 0;
    let publicRef: string | undefined;

    if (invoice.order) {
      customerName = invoice.order.customerName;
      customerEmail = invoice.order.customerEmail;
      items = invoice.order.orderItems.map(i => ({ name: i.name, quantity: i.quantity, unitCents: i.unitCents, totalCents: i.totalCents }));
      subtotalCents = invoice.order.subtotalCents;
      shippingCents = invoice.order.shippingCents;
      taxCents = invoice.order.taxCents;
      publicRef = invoice.order.publicRef;
    } else if (invoice.quote) {
      const snap = invoice.quote.customerSnapshot as { name: string; email: string };
      customerName = snap.name;
      customerEmail = snap.email;
      items = (invoice.quote.items as typeof items) ?? [];
      subtotalCents = invoice.quote.subtotalCents;
      shippingCents = invoice.quote.shippingCents;
      taxCents = invoice.quote.taxCents;
      publicRef = invoice.quote.publicRef;
    }

    const pdfResult = await generateInvoicePdf({
      invoiceNumber: invoice.invoiceNumber,
      type: invoice.type,
      status: invoice.status,
      issuedAt: invoice.issuedAt ?? new Date(),
      paidAt: invoice.paidAt ?? undefined,
      customerName,
      customerEmail,
      items,
      subtotalCents,
      shippingCents,
      taxCents,
      totalCents: invoice.amountCents,
      publicRef,
    });

    await prisma.invoice.update({ where: { id: invoice.id }, data: { pdfPath: pdfResult.pdfPath } });
    res.json({ ok: true, pdfPath: pdfResult.pdfPath });
  } catch (err) {
    logger.error('[INVOICE] PDF regeneration failed', err);
    res.status(500).json({ error: 'PDF generation failed' });
  }
}
