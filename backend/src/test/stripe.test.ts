import { describe, it, expect, vi } from 'vitest';
import { mockPrisma } from './mockPrisma';

vi.mock('../config/prisma', () => ({ prisma: mockPrisma }));

describe('Stripe désactivé par défaut', () => {
  it('STRIPE_ENABLED est false dans la config de test', () => {
    expect(process.env['STRIPE_ENABLED']).toBe('false');
  });

  it('createCheckoutSession retourne un mock session quand STRIPE_ENABLED=false', async () => {
    const { createCheckoutSession, isStripeEnabled } = await import('../services/stripe/stripeService');
    expect(isStripeEnabled()).toBe(false);

    const result = await createCheckoutSession({
      idempotencyKey: 'test-key-1',
      customerEmail: 'test@test.fr',
      amountCents: 1990,
      description: 'Test Commande CBD',
    });

    expect(result.sessionId).toContain('mock_session');
    expect(result.checkoutUrl).toBeDefined();
  });

  it('isStripeEnabled retourne false si STRIPE_ENABLED=false', async () => {
    const { isStripeEnabled } = await import('../services/stripe/stripeService');
    expect(isStripeEnabled()).toBe(false);
  });
});
