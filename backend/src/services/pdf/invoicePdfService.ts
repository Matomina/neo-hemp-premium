import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { ENV } from '../../config/env';
import { logger } from '../../utils/logger';

export interface InvoiceLineItem {
  name: string;
  quantity: number;
  unitCents: number;
  totalCents: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  type: 'QUOTE' | 'ORDER';
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'CANCELLED';
  issuedAt: Date;
  paidAt?: Date;
  customerName: string;
  customerEmail: string;
  billingAddress?: string;
  items: InvoiceLineItem[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  currency?: string;
  adminNotes?: string;
  publicRef?: string;
}

function centsToCurrency(cents: number): string {
  return `${(cents / 100).toFixed(2).replace('.', ',')} €`;
}

function ensureStorageDir(): string {
  const dir = path.resolve(ENV.STORAGE_PATH, 'invoices');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export async function generateInvoicePdf(data: InvoiceData): Promise<{ pdfPath: string }> {
  const dir = ensureStorageDir();
  const filename = `${data.invoiceNumber.replace(/\//g, '-')}.pdf`;
  const pdfPath = path.join(dir, filename);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // ── Header ──────────────────────────────────────────────────────────────
    doc.fillColor('#d6ff31').fontSize(22).font('Helvetica-Bold').text('◆ CULTURE BIO DIAMANT', 50, 45);
    doc.fillColor('#999').fontSize(9).font('Helvetica').text('Sélection CBD premium · Conformité & traçabilité · Taux THC < 0,3%', 50, 72);

    doc.moveTo(50, 90).lineTo(545, 90).strokeColor('#333').lineWidth(1).stroke();

    // ── Type & numéro ────────────────────────────────────────────────────────
    const typeLabel = data.type === 'QUOTE' ? 'DEVIS' : 'FACTURE';
    doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text(typeLabel, 50, 105);
    doc.fillColor('#d6ff31').fontSize(12).text(`N° ${data.invoiceNumber}`, 50, 125);
    if (data.publicRef) doc.fillColor('#888').fontSize(10).font('Helvetica').text(`Réf : ${data.publicRef}`, 50, 142);

    // Status badge
    const statusColors: Record<string, string> = { DRAFT: '#888', ISSUED: '#bb35ff', PAID: '#d6ff31', CANCELLED: '#ff4444' };
    const statusLabels: Record<string, string> = { DRAFT: 'Brouillon', ISSUED: 'En attente de paiement', PAID: 'Payé', CANCELLED: 'Annulé' };
    doc.fillColor(statusColors[data.status] ?? '#888').fontSize(10).font('Helvetica-Bold').text(statusLabels[data.status] ?? data.status, 400, 105, { align: 'right' });

    // ── Dates ────────────────────────────────────────────────────────────────
    doc.fillColor('#aaa').fontSize(9).font('Helvetica');
    doc.text(`Date d'émission : ${data.issuedAt.toLocaleDateString('fr-FR')}`, 400, 122, { align: 'right' });
    if (data.paidAt) doc.text(`Date de paiement : ${data.paidAt.toLocaleDateString('fr-FR')}`, 400, 135, { align: 'right' });

    // ── Client ───────────────────────────────────────────────────────────────
    doc.fillColor('#888').fontSize(8).font('Helvetica-Bold').text('CLIENT', 50, 175);
    doc.fillColor('#fff').fontSize(10).font('Helvetica').text(data.customerName, 50, 188);
    doc.fillColor('#aaa').fontSize(9).text(data.customerEmail, 50, 202);
    if (data.billingAddress) doc.text(data.billingAddress, 50, 216);

    doc.moveTo(50, 240).lineTo(545, 240).strokeColor('#333').lineWidth(0.5).stroke();

    // ── Table header ─────────────────────────────────────────────────────────
    let y = 255;
    doc.fillColor('#555').fontSize(8).font('Helvetica-Bold');
    doc.text('DÉSIGNATION', 50, y);
    doc.text('QTÉ', 320, y, { width: 60, align: 'right' });
    doc.text('P.U.', 385, y, { width: 70, align: 'right' });
    doc.text('TOTAL', 460, y, { width: 85, align: 'right' });

    doc.moveTo(50, y + 14).lineTo(545, y + 14).strokeColor('#444').lineWidth(0.5).stroke();
    y += 22;

    // ── Items ────────────────────────────────────────────────────────────────
    doc.font('Helvetica').fontSize(9);
    for (const item of data.items) {
      doc.fillColor('#e0e0e0').text(item.name, 50, y, { width: 265 });
      doc.fillColor('#aaa').text(String(item.quantity), 320, y, { width: 60, align: 'right' });
      doc.text(centsToCurrency(item.unitCents), 385, y, { width: 70, align: 'right' });
      doc.fillColor('#e0e0e0').text(centsToCurrency(item.totalCents), 460, y, { width: 85, align: 'right' });
      y += 20;
    }

    doc.moveTo(50, y + 5).lineTo(545, y + 5).strokeColor('#333').lineWidth(0.5).stroke();
    y += 18;

    // ── Totals ───────────────────────────────────────────────────────────────
    doc.fillColor('#888').fontSize(9).font('Helvetica');
    doc.text('Sous-total', 385, y, { width: 70, align: 'right' });
    doc.fillColor('#ccc').text(centsToCurrency(data.subtotalCents), 460, y, { width: 85, align: 'right' });
    y += 16;

    if (data.shippingCents > 0) {
      doc.fillColor('#888').text('Livraison', 385, y, { width: 70, align: 'right' });
      doc.fillColor('#ccc').text(centsToCurrency(data.shippingCents), 460, y, { width: 85, align: 'right' });
      y += 16;
    }

    if (data.taxCents > 0) {
      doc.fillColor('#888').text('TVA', 385, y, { width: 70, align: 'right' });
      doc.fillColor('#ccc').text(centsToCurrency(data.taxCents), 460, y, { width: 85, align: 'right' });
      y += 16;
    }

    doc.moveTo(385, y + 2).lineTo(545, y + 2).strokeColor('#d6ff31').lineWidth(0.8).stroke();
    y += 10;
    doc.fillColor('#d6ff31').fontSize(11).font('Helvetica-Bold');
    doc.text('TOTAL', 385, y, { width: 70, align: 'right' });
    doc.text(centsToCurrency(data.totalCents), 460, y, { width: 85, align: 'right' });

    // ── Admin notes ──────────────────────────────────────────────────────────
    if (data.adminNotes) {
      y += 40;
      doc.fillColor('#888').fontSize(8).font('Helvetica-Bold').text('NOTES', 50, y);
      y += 12;
      doc.fillColor('#aaa').fontSize(8).font('Helvetica').text(data.adminNotes, 50, y, { width: 495 });
    }

    // ── Legal footer ─────────────────────────────────────────────────────────
    const footerY = 750;
    doc.moveTo(50, footerY).lineTo(545, footerY).strokeColor('#333').lineWidth(0.5).stroke();
    doc.fillColor('#555').fontSize(7.5).font('Helvetica');
    doc.text(
      'Culture Bio Diamant — Produits à base de chanvre conformes à la réglementation française (THC < 0,3%). ' +
      'Aucune promesse médicale ou thérapeutique. Vente réservée aux personnes majeures. ' +
      'Mentions légales et CGV disponibles sur le site. ' +
      'Ce document ne constitue pas une facture définitive tant que le paiement n\'est pas confirmé.',
      50, footerY + 8, { width: 495 },
    );

    doc.end();

    stream.on('finish', () => {
      logger.info(`[PDF] Generated ${pdfPath}`);
      resolve({ pdfPath });
    });
    stream.on('error', (err) => {
      logger.error('[PDF] Error generating PDF', err);
      reject(err);
    });
  });
}
