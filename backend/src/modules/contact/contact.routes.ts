import { Router } from 'express';
import { requireAdmin } from '../../middleware/adminAuth';
import { submitContact, adminListContacts, adminGetContact, adminUpdateContact } from './contact.controller';

const router = Router();

router.post('/', submitContact);
router.get('/admin', requireAdmin, adminListContacts);
router.get('/admin/:id', requireAdmin, adminGetContact);
router.patch('/admin/:id', requireAdmin, adminUpdateContact);

export default router;
