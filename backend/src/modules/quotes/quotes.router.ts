import { Router } from 'express';
import { requireAdmin } from '../../middleware/adminAuth';
import {
  createQuote,
  adminListQuotes,
  adminGetQuote,
  adminUpdateQuote,
  adminApproveQuote,
  adminSendQuotePayment,
  adminCancelQuote,
} from './quotes.controller';

const router = Router();

// Public
router.post('/', createQuote);

// Admin
router.get('/admin', requireAdmin, adminListQuotes);
router.get('/admin/:id', requireAdmin, adminGetQuote);
router.patch('/admin/:id', requireAdmin, adminUpdateQuote);
router.post('/admin/:id/approve', requireAdmin, adminApproveQuote);
router.post('/admin/:id/send-payment', requireAdmin, adminSendQuotePayment);
router.post('/admin/:id/cancel', requireAdmin, adminCancelQuote);

export default router;
