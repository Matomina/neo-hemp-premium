import { Router } from 'express';
import { requireAdmin } from '../../middleware/adminAuth';
import { adminListInvoices, adminGetInvoice, adminDownloadInvoicePdf, adminRegeneratePdf } from './invoices.controller';

const router = Router();

router.get('/', requireAdmin, adminListInvoices);
router.get('/:id', requireAdmin, adminGetInvoice);
router.get('/:id/pdf', requireAdmin, adminDownloadInvoicePdf);
router.post('/:id/regenerate-pdf', requireAdmin, adminRegeneratePdf);

export default router;
