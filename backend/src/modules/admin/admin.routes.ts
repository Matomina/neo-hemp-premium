import { Router } from 'express';
import { adminCertificates, adminMarkMessageRead, adminMessages, adminOrders, adminUpdateOrderStatus } from './admin.controller';
import { requireAdmin } from '../../middleware/adminAuth';

const router = Router();
router.use(requireAdmin);
router.get('/orders', adminOrders);
router.patch('/orders/:id/status', adminUpdateOrderStatus);
router.get('/contact-messages', adminMessages);
router.patch('/contact-messages/:id', adminMarkMessageRead);
router.get('/certificates', adminCertificates);
export default router;
