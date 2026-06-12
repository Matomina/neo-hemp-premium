import { Router } from 'express';
import { requireAdmin } from '../../../middleware/adminAuth';
import { adminLogin, adminLogout, adminMe } from './adminAuth.controller';

const router = Router();

router.post('/login', adminLogin);
router.post('/logout', requireAdmin, adminLogout);
router.get('/me', requireAdmin, adminMe);

export default router;
