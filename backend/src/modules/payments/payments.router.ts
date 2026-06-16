import { Router } from 'express';
import { captureRawBody } from '../../middleware/rawBody';
import { requireAdmin } from '../../middleware/adminAuth';
import { stripeWebhook, adminListPayments, adminGetPayment } from './payments.controller';

const router = Router();

// Stripe webhook — MUST use raw body, no JSON parsing
router.post('/webhook', captureRawBody, stripeWebhook);

// Admin
router.get('/admin', requireAdmin, adminListPayments);
router.get('/admin/:id', requireAdmin, adminGetPayment);

export default router;
