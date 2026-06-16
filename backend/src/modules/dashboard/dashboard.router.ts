import { Router } from 'express';
import { requireAdmin } from '../../middleware/adminAuth';
import { getDashboardSummary, getDashboardActivity } from './dashboard.controller';

const router = Router();

router.get('/summary', requireAdmin, getDashboardSummary);
router.get('/activity', requireAdmin, getDashboardActivity);

export default router;
