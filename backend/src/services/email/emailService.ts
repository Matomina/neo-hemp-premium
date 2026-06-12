import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { ENV, IS_DEV } from '../../config/env';
import { logger } from '../../utils/logger';
import { prisma } from '../../config/prisma';
import type { EmailStatus } from '@prisma/client';

let _transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (_transporter) return _transporter;
  if (!ENV.SMTP_HOST || !ENV.SMTP_USER) return null;

  _transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_SECURE,
    auth: { user: ENV.SMTP_USER, pass: ENV.SMTP_PASS },
  });
  return _transporter;
}

export interface SendEmailOptions {
  type: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  quoteId?: string;
  orderId?: string;
  attachments?: Array<{ filename: string; path?: string; content?: Buffer }>;
}

export async function sendEmail(opts: SendEmailOptions): Promise<void> {
  const transporter = getTransporter();

  let status!: EmailStatus;
  let providerMessageId: string | undefined;
  let error: string | undefined;

  try {
    if (!transporter) {
      if (IS_DEV) {
        logger.info(`[EMAIL DEV] type=${opts.type} to=${opts.to} subject="${opts.subject}"`);
        logger.info(`[EMAIL DEV] html-preview: ${opts.html.slice(0, 300)}...`);
        status = 'SKIPPED_DEV';
      } else {
        throw new Error('SMTP not configured in production');
      }
    } else {
      const info = await transporter.sendMail({
        from: ENV.SMTP_FROM,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
        attachments: opts.attachments,
      });
      providerMessageId = info.messageId;
      status = 'SENT';
      logger.info(`[EMAIL] Sent type=${opts.type} to=${opts.to} msgId=${info.messageId}`);
    }
  } catch (err) {
    status = 'FAILED';
    error = err instanceof Error ? err.message : String(err);
    logger.error(`[EMAIL] Failed type=${opts.type} to=${opts.to}`, error);
  }

  await prisma.emailLog.create({
    data: {
      type: opts.type,
      to: opts.to,
      subject: opts.subject,
      status,
      providerMessageId,
      payload: { html: opts.html.slice(0, 500) },
      error,
      quoteId: opts.quoteId,
      orderId: opts.orderId,
    },
  });
}

// ── Email templates ───────────────────────────────────────────────────────────

function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>${title}</title>
<style>
  body{font-family:Arial,sans-serif;background:#0a0a0a;color:#e0e0e0;margin:0;padding:0}
  .wrap{max-width:600px;margin:40px auto;background:#111;border:1px solid #222;border-radius:12px;overflow:hidden}
  .header{background:#111;padding:32px 40px;border-bottom:2px solid #d6ff31;text-align:center}
  .header h1{color:#d6ff31;font-size:20px;margin:0;letter-spacing:2px}
  .header p{color:#888;font-size:13px;margin:6px 0 0}
  .body{padding:32px 40px}
  .body h2{color:#fff;margin-top:0}
  .body p{color:#ccc;line-height:1.7;font-size:14px}
  .badge{display:inline-block;background:#1a1a1a;border:1px solid #d6ff31;color:#d6ff31;padding:4px 12px;border-radius:20px;font-size:12px;margin:4px 2px}
  .btn{display:inline-block;background:#d6ff31;color:#000;padding:14px 28px;border-radius:8px;font-weight:700;text-decoration:none;margin:20px 0;font-size:15px}
  .table{width:100%;border-collapse:collapse;margin:16px 0}
  .table th,.table td{padding:10px 12px;text-align:left;font-size:13px;border-bottom:1px solid #222}
  .table th{color:#888;font-weight:600}
  .table td{color:#ccc}
  .total{color:#d6ff31;font-weight:700;font-size:15px}
  .footer{background:#0a0a0a;padding:20px 40px;text-align:center;font-size:11px;color:#444;border-top:1px solid #1a1a1a}
  .legal{font-size:11px;color:#555;margin-top:20px;padding-top:12px;border-top:1px solid #222}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>◆ CULTURE BIO DIAMANT</h1>
    <p>Sélection CBD premium · Conformité &amp; traçabilité</p>
  </div>
  <div class="body">${body}</div>
  <div class="footer">
    Culture Bio Diamant — Produits à base de chanvre conformes à la réglementation française.<br>
    Aucune promesse médicale ou thérapeutique. Taux THC &lt; 0,3%. Usage réservé aux majeurs.<br>
    Ce message est automatique, merci de ne pas répondre directement.
  </div>
</div>
</body>
</html>`;
}

// 1. Client — demande de devis reçue
export function tplQuoteRequestClient(data: { ref: string; customerName: string; totalCents: number }): { subject: string; html: string } {
  const subject = `Votre demande de devis CBD — Réf. ${data.ref}`;
  const html = layout(subject, `
    <h2>Merci pour votre demande, ${data.customerName} !</h2>
    <p>Nous avons bien reçu votre demande de devis <span class="badge">${data.ref}</span></p>
    <p>Notre équipe la traite sous 24–48h ouvrées. Vous recevrez un email dès validation avec votre devis, la facture PDF et le lien de paiement sécurisé.</p>
    <p><strong>Montant estimé :</strong> <span class="total">${(data.totalCents / 100).toFixed(2).replace('.', ',')} €</span></p>
    <p class="legal">Les produits à base de chanvre (CBD) sont soumis à conformité réglementaire. Aucune promesse médicale ou thérapeutique n'est associée à cette commande.</p>
  `);
  return { subject, html };
}

// 2. Admin — nouvelle demande de devis
export function tplQuoteRequestAdmin(data: { ref: string; customerName: string; customerEmail: string; totalCents: number; adminUrl: string }): { subject: string; html: string } {
  const subject = `[ADMIN] Nouvelle demande de devis — ${data.ref}`;
  const html = layout(subject, `
    <h2>Nouvelle demande de devis</h2>
    <p>Réf. <span class="badge">${data.ref}</span></p>
    <p><strong>Client :</strong> ${data.customerName} (${data.customerEmail})<br>
    <strong>Montant estimé :</strong> ${(data.totalCents / 100).toFixed(2).replace('.', ',')} €</p>
    <a href="${data.adminUrl}" class="btn">Voir dans le dashboard</a>
  `);
  return { subject, html };
}

// 3. Client — devis validé + facture + lien paiement
export function tplQuoteApprovedClient(data: { ref: string; customerName: string; totalCents: number; paymentUrl: string }): { subject: string; html: string } {
  const subject = `Votre devis CBD est validé — Procédez au paiement`;
  const html = layout(subject, `
    <h2>Votre devis a été validé !</h2>
    <p>Bonjour ${data.customerName},</p>
    <p>Votre devis <span class="badge">${data.ref}</span> a été examiné et approuvé par notre équipe.</p>
    <p><strong>Total à régler :</strong> <span class="total">${(data.totalCents / 100).toFixed(2).replace('.', ',')} €</span></p>
    <p>Votre facture PDF est jointe à cet email. Pour finaliser votre commande, cliquez ci-dessous :</p>
    <a href="${data.paymentUrl}" class="btn">Procéder au paiement sécurisé</a>
    <p class="legal">Paiement sécurisé via Stripe (mode test). Les produits CBD sont soumis à conformité réglementaire.</p>
  `);
  return { subject, html };
}

// 4. Client — paiement devis confirmé
export function tplQuotePaidClient(data: { ref: string; customerName: string; totalCents: number }): { subject: string; html: string } {
  const subject = `Paiement confirmé — Commande CBD ${data.ref}`;
  const html = layout(subject, `
    <h2>Paiement reçu — Merci !</h2>
    <p>Bonjour ${data.customerName},</p>
    <p>Votre paiement pour le devis <span class="badge">${data.ref}</span> a bien été reçu.</p>
    <p><strong>Montant :</strong> <span class="total">${(data.totalCents / 100).toFixed(2).replace('.', ',')} €</span></p>
    <p>Votre facture finale est jointe à cet email. Notre équipe prépare votre commande.</p>
  `);
  return { subject, html };
}

// 5. Client — commande panier soumise
export function tplOrderSubmittedClient(data: { ref: string; customerName: string; totalCents: number }): { subject: string; html: string } {
  const subject = `Votre commande CBD est en cours de validation — ${data.ref}`;
  const html = layout(subject, `
    <h2>Commande reçue — Validation en cours</h2>
    <p>Bonjour ${data.customerName},</p>
    <p>Votre commande <span class="badge">${data.ref}</span> a bien été soumise.</p>
    <p><strong>Total estimé :</strong> <span class="total">${(data.totalCents / 100).toFixed(2).replace('.', ',')} €</span></p>
    <p>Notre équipe valide votre commande sous 24–48h. Vous recevrez votre facture et le lien de paiement par email dès approbation.</p>
    <p class="legal">Les produits CBD sont soumis à conformité réglementaire. Aucune promesse médicale n'est associée à cette commande.</p>
  `);
  return { subject, html };
}

// 6. Admin — nouvelle commande panier
export function tplOrderSubmittedAdmin(data: { ref: string; customerName: string; customerEmail: string; totalCents: number; adminUrl: string }): { subject: string; html: string } {
  const subject = `[ADMIN] Nouvelle commande panier — ${data.ref}`;
  const html = layout(subject, `
    <h2>Nouvelle commande panier</h2>
    <p>Réf. <span class="badge">${data.ref}</span></p>
    <p><strong>Client :</strong> ${data.customerName} (${data.customerEmail})<br>
    <strong>Total :</strong> ${(data.totalCents / 100).toFixed(2).replace('.', ',')} €</p>
    <a href="${data.adminUrl}" class="btn">Voir dans le dashboard</a>
  `);
  return { subject, html };
}

// 7. Client — commande validée + facture + lien paiement
export function tplOrderApprovedClient(data: { ref: string; customerName: string; totalCents: number; paymentUrl: string }): { subject: string; html: string } {
  const subject = `Commande validée — Procédez au paiement`;
  const html = layout(subject, `
    <h2>Votre commande a été validée !</h2>
    <p>Bonjour ${data.customerName},</p>
    <p>Votre commande <span class="badge">${data.ref}</span> a été approuvée.</p>
    <p><strong>Total :</strong> <span class="total">${(data.totalCents / 100).toFixed(2).replace('.', ',')} €</span></p>
    <p>Votre facture PDF est jointe. Finalisez votre commande en procédant au paiement :</p>
    <a href="${data.paymentUrl}" class="btn">Procéder au paiement sécurisé</a>
  `);
  return { subject, html };
}

// 8. Client — paiement commande confirmé
export function tplOrderPaidClient(data: { ref: string; customerName: string; totalCents: number }): { subject: string; html: string } {
  const subject = `Paiement confirmé — Commande ${data.ref}`;
  const html = layout(subject, `
    <h2>Paiement reçu — Votre commande est confirmée !</h2>
    <p>Bonjour ${data.customerName},</p>
    <p>Votre paiement pour la commande <span class="badge">${data.ref}</span> a bien été reçu.</p>
    <p><strong>Montant :</strong> <span class="total">${(data.totalCents / 100).toFixed(2).replace('.', ',')} €</span></p>
    <p>La facture finale est jointe. Votre colis sera préparé et expédié rapidement.</p>
  `);
  return { subject, html };
}

// 9. Client — accusé réception message contact
export function tplContactReceivedClient(data: { name: string }): { subject: string; html: string } {
  const subject = `Votre message a bien été reçu — Culture Bio Diamant`;
  const html = layout(subject, `
    <h2>Message reçu</h2>
    <p>Bonjour ${data.name},</p>
    <p>Nous avons bien reçu votre message et vous répondrons sous 24–48h ouvrées.</p>
  `);
  return { subject, html };
}

// 10. Admin — nouveau message contact
export function tplContactAdmin(data: { name: string; email: string; subject: string; message: string; adminUrl: string }): { subject: string; html: string } {
  const emailSubject = `[ADMIN] Nouveau message contact — ${data.name}`;
  const html = layout(emailSubject, `
    <h2>Nouveau message de contact</h2>
    <p><strong>De :</strong> ${data.name} (${data.email})</p>
    <p><strong>Sujet :</strong> ${data.subject || '—'}</p>
    <p><strong>Message :</strong><br>${data.message.replace(/\n/g, '<br>')}</p>
    <a href="${data.adminUrl}" class="btn">Voir dans le dashboard</a>
  `);
  return { subject: emailSubject, html };
}
