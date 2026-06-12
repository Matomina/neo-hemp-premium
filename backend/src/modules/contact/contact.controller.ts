import type { Request, RequestHandler, Response } from 'express';
import { ContactSchema } from './contact.schemas';
import { saveContactMessage } from './contact.service';
import { sendEmail, tplContactReceivedClient, tplContactAdmin } from '../../services/email/emailService';
import { prisma } from '../../config/prisma';
import { ENV } from '../../config/env';
import { z } from 'zod';

const ADMIN_EMAIL_TO = ENV.ADMIN_EMAIL || 'admin@culturebiodiamant.fr';
const ADMIN_URL = `${ENV.FRONTEND_ORIGINS[0]}/admin/contacts`;

export const submitContact: RequestHandler = async (req, res, next) => {
  try {
    const data = ContactSchema.parse(req.body);
    const msg = await saveContactMessage(data);

    void sendEmail({
      type: 'CONTACT_RECEIVED_CLIENT',
      to: data.email,
      ...tplContactReceivedClient({ name: data.name }),
    });
    void sendEmail({
      type: 'CONTACT_ADMIN',
      to: ADMIN_EMAIL_TO,
      ...tplContactAdmin({ name: data.name, email: data.email, subject: data.subject ?? '', message: data.message, adminUrl: `${ADMIN_URL}/${msg.id}` }),
    });

    res.status(201).json({ success: true, message: 'Message reçu, nous vous répondrons rapidement.' });
  } catch (err) { next(err); }
};

// GET /api/admin/contacts
export async function adminListContacts(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(String(req.query['page'] ?? '1'), 10));
  const limit = Math.min(50, parseInt(String(req.query['limit'] ?? '20'), 10));
  const [items, total] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.contactMessage.count(),
  ]);
  res.json({ items, total, page, limit });
}

// GET /api/admin/contacts/:id
export async function adminGetContact(req: Request, res: Response): Promise<void> {
  const msg = await prisma.contactMessage.findUnique({ where: { id: String(req.params['id']) } });
  if (!msg) { res.status(404).json({ error: 'Contact message not found' }); return; }
  res.json(msg);
}

// PATCH /api/admin/contacts/:id
export async function adminUpdateContact(req: Request, res: Response): Promise<void> {
  const UpdateSchema = z.object({
    isRead: z.boolean().optional(),
    status: z.enum(['NEW', 'READ', 'ARCHIVED']).optional(),
    adminNotes: z.string().optional(),
  });
  const parsed = UpdateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Validation error' }); return; }

  const updated = await prisma.contactMessage.update({
    where: { id: String(req.params['id']) },
    data: parsed.data,
  });
  res.json(updated);
}
