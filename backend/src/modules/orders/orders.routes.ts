import { Router } from 'express';
import { confirmOrderHandler, draftOrder } from './orders.controller';

const router = Router();
router.post('/draft', draftOrder);
router.post('/:id/confirm', confirmOrderHandler);
export default router;
