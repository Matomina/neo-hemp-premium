import type { RequestHandler } from 'express';
import { ContactSchema } from './contact.schemas';
import { saveContactMessage } from './contact.service';

export const submitContact: RequestHandler = async (req, res, next) => {
  try {
    const data = ContactSchema.parse(req.body);
    await saveContactMessage(data);
    res.status(201).json({ success: true, message: 'Message reçu, nous vous répondrons rapidement.' });
  } catch (err) { next(err); }
};
