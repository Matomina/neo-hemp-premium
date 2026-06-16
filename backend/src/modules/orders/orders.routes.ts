import { Router } from 'express';
import { requireAdmin } from '../../middleware/adminAuth';
import {
  submitOrder,
  draftOrder,
  confirmOrderHandler,
  adminListOrders,
  adminGetOrder,
  adminUpdateOrder,
  adminApproveOrder,
  adminSendOrderPayment,
  adminCancelOrder,
} from './orders.controller';

const router = Router();

// Public
router.post('/', submitOrder);
router.post('/draft', draftOrder);
router.post('/:id/confirm', confirmOrderHandler);

// Admin
router.get('/admin', requireAdmin, adminListOrders);
router.get('/admin/:id', requireAdmin, adminGetOrder);
router.patch('/admin/:id', requireAdmin, adminUpdateOrder);
router.post('/admin/:id/approve', requireAdmin, adminApproveOrder);
router.post('/admin/:id/send-payment', requireAdmin, adminSendOrderPayment);
router.post('/admin/:id/cancel', requireAdmin, adminCancelOrder);

export default router;
