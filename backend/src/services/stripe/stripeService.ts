import Stripe from 'stripe';
import { ENV } from '../../config/env';
import { logger } from '../../utils/logger';

type StripeInstance = InstanceType<typeof Stripe>;

let _stripe: StripeInstance | null = null;

export function getStripe(): StripeInstance {
  if (_stripe) return _stripe;
  if (!ENV.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  _stripe = new Stripe(ENV.STRIPE_SECRET_KEY, { apiVersion: '2026-05-27.dahlia' });
  return _stripe;
}

export function isStripeEnabled(): boolean {
  return ENV.STRIPE_ENABLED && Boolean(ENV.STRIPE_SECRET_KEY);
}

export interface CreateCheckoutSessionParams {
  idempotencyKey: string;
  customerEmail: string;
  amountCents: number;
  currency?: string;
  description: string;
  metadata?: Record<string, string>;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResult {
  sessionId: string;
  checkoutUrl: string;
  paymentIntentId?: string;
}

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams,
): Promise<CheckoutSessionResult> {
  if (!isStripeEnabled()) {
    logger.warn('[STRIPE] Stripe disabled — returning mock checkout session');
    return {
      sessionId: `mock_session_${params.idempotencyKey}`,
      checkoutUrl: `${ENV.STRIPE_SUCCESS_URL}?mock=1`,
    };
  }

  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create(
    {
      payment_method_types: ['card'],
      customer_email: params.customerEmail,
      line_items: [
        {
          price_data: {
            currency: params.currency ?? 'eur',
            product_data: { name: params.description },
            unit_amount: params.amountCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: params.successUrl ?? ENV.STRIPE_SUCCESS_URL,
      cancel_url: params.cancelUrl ?? ENV.STRIPE_CANCEL_URL,
      metadata: params.metadata ?? {},
    },
    { idempotencyKey: params.idempotencyKey },
  );

  return {
    sessionId: session.id,
    checkoutUrl: session.url ?? '',
    paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
  };
}

export function verifyWebhookSignature(payload: Buffer, signature: string) {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(payload, signature, ENV.STRIPE_WEBHOOK_SECRET);
}
