import { Router } from 'express';
import { captureRawBody } from '../../middleware/rawBody';
import { stripeWebhook } from './payments.controller';

const router = Router();

// Stripe webhook — MUST use raw body, registered BEFORE express.json()
router.post('/webhook', captureRawBody, stripeWebhook);

export default router;
