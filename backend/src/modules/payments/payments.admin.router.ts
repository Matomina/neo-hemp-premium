import { Router } from 'express';
import { adminListPayments, adminGetPayment } from './payments.controller';

const router = Router();

// GET /api/admin/payments
router.get('/', adminListPayments);

// GET /api/admin/payments/:id
router.get('/:id', adminGetPayment);

export default router;
