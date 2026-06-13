import { Router } from 'express';
import { getReviewsHandler, createReviewHandler } from './reviews.controller';
import { defaultRateLimit } from '../../middlewares/rateLimit';

const router = Router();
router.get('/:productId', getReviewsHandler);
router.post('/', defaultRateLimit, createReviewHandler);
export default router;
