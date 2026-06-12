import type { RequestHandler } from 'express';
import { DraftOrderSchema } from './orders.schemas';
import { confirmOrder, createDraftOrder } from './orders.service';

export const draftOrder: RequestHandler = async (req, res, next) => {
  try {
    const data = DraftOrderSchema.parse(req.body);
    const order = await createDraftOrder(data);
    res.status(201).json({ ...order, _notice: 'Commande simulée — paiement non activé.' });
  } catch (err) { next(err); }
};

export const confirmOrderHandler: RequestHandler = async (req, res, next) => {
  try {
    const order = await confirmOrder(String(req.params.id));
    if (!order) { res.status(404).json({ error: 'Order not found' }); return; }
    res.json({ ...order, _notice: 'Commande simulée — paiement non activé.' });
  } catch (err) { next(err); }
};
