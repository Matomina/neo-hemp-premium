import { describe, it, expect, beforeAll, vi } from 'vitest';
import type { Application } from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { mockPrisma } from './mockPrisma';

vi.mock('../config/prisma', () => ({ prisma: mockPrisma }));

const adminToken = jwt.sign(
  { sub: 'admin-id', email: 'admin@test.local', role: 'ADMIN' },
  process.env['JWT_SECRET']!,
  { expiresIn: '1h' },
);

describe('Payment link idempotence', () => {
  let app: Application;

  beforeAll(async () => {
    const mod = await import('../app');
    app = mod.default;
  });

  it('réutilise le lien de paiement existant pour une commande', async () => {
    mockPrisma.order.findUnique.mockResolvedValueOnce({
      id: 'order-1',
      publicRef: 'CBD-CMD-20260615-AAAAA',
      customerEmail: 'client@test.fr',
      customerName: 'Client Test',
      totalCents: 2470,
      subtotalCents: 1980,
      shippingCents: 490,
      taxCents: 0,
      status: 'APPROVED',
      orderItems: [],
      invoices: [{ id: 'inv-1', pdfPath: '/tmp/inv-1.pdf' }],
      payments: [],
      emails: [],
    });
    mockPrisma.payment.findFirst.mockResolvedValueOnce({
      id: 'pay-1',
      status: 'CREATED',
      checkoutUrl: 'https://checkout.stripe.test/session-1',
    });

    const res = await request(app)
      .post('/api/orders/admin/order-1/send-payment')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.reused).toBe(true);
    expect(res.body.checkoutUrl).toBe('https://checkout.stripe.test/session-1');
    expect(mockPrisma.payment.create).not.toHaveBeenCalled();
  });

  it('réutilise le lien de paiement existant pour un devis', async () => {
    mockPrisma.quoteRequest.findUnique.mockResolvedValueOnce({
      id: 'quote-1',
      publicRef: 'CBD-DEV-20260615-BBBBB',
      totalCents: 5800,
      subtotalCents: 5800,
      shippingCents: 0,
      taxCents: 0,
      status: 'APPROVED',
      customerSnapshot: { name: 'Client Test', email: 'client@test.fr' },
      items: [],
      invoices: [{ id: 'inv-q-1', pdfPath: '/tmp/inv-q-1.pdf' }],
      payments: [],
      emails: [],
    });
    mockPrisma.payment.findFirst.mockResolvedValueOnce({
      id: 'pay-q-1',
      status: 'CREATED',
      checkoutUrl: 'https://checkout.stripe.test/session-q-1',
    });

    const res = await request(app)
      .post('/api/quotes/admin/quote-1/send-payment')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.reused).toBe(true);
    expect(res.body.checkoutUrl).toBe('https://checkout.stripe.test/session-q-1');
    expect(mockPrisma.payment.create).not.toHaveBeenCalled();
  });
});
