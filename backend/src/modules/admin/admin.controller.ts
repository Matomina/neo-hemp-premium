import type { RequestHandler } from 'express';
import { OrderStatusUpdateSchema } from './admin.schemas';
import { listAdminOrders, listContactMessages, markContactRead, updateOrderStatus } from './admin.service';
import { listAllCertificates } from '../certificates/certificates.service';

export const adminOrders: RequestHandler = async (_req, res, next) => {
  try { res.json(await listAdminOrders()); } catch (err) { next(err); }
};

export const adminUpdateOrderStatus: RequestHandler = async (req, res, next) => {
  try {
    const { status } = OrderStatusUpdateSchema.parse(req.body);
    res.json(await updateOrderStatus(String(req.params.id), status));
  } catch (err) { next(err); }
};

export const adminMessages: RequestHandler = async (_req, res, next) => {
  try { res.json(await listContactMessages()); } catch (err) { next(err); }
};

export const adminMarkMessageRead: RequestHandler = async (req, res, next) => {
  try { res.json(await markContactRead(String(req.params.id))); } catch (err) { next(err); }
};

export const adminCertificates: RequestHandler = async (_req, res, next) => {
  try { res.json(await listAllCertificates()); } catch (err) { next(err); }
};
