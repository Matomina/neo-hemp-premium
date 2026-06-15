import { describe, it, expect, beforeAll, vi } from 'vitest';
import type { Application } from 'express';
import request from 'supertest';
import { mockPrisma } from './mockPrisma';

vi.mock('../config/prisma', () => ({ prisma: mockPrisma }));

const validOrderPayload = {
  items: [
    { id: 'prod-1', name: 'Fleur CBD Test', price: 9.90, quantity: 2 },
  ],
  customerEmail: 'client@test.fr',
  customerName: 'Jean Dupont',
  customerPhone: '+33612345678',
  addressLine1: '12 Rue de la Paix',
  postalCode: '75001',
  city: 'Paris',
  country: 'FR',
  adultConfirmed: true,
  termsAccepted: true,
};

const mockCreatedOrder = {
  id: 'order-test-id-1',
  publicRef: 'CBD-CMD-20240101-0001',
  customerEmail: validOrderPayload.customerEmail,
  customerName: validOrderPayload.customerName,
  subtotalCents: 1980,
  totalCents: 1980,
  status: 'CART_SUBMITTED',
  orderItems: [],
  adultConfirmed: true,
  termsAccepted: true,
  items: validOrderPayload.items,
  customerPhone: validOrderPayload.customerPhone,
  customerSnapshot: {},
  taxCents: 0,
  shippingCents: 0,
  currency: 'EUR',
  adminNotes: null,
  note: null,
  customerId: null,
  userId: null,
  orderNumber: null,
  approvedAt: null,
  paymentSentAt: null,
  paidAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  invoices: [],
  payments: [],
  emails: [],
};

describe('POST /api/orders', () => {
  let app: Application;

  beforeAll(async () => {
    const mod = await import('../app');
    app = mod.default;
  });

  it('crée une commande valide et retourne 201', async () => {
    mockPrisma.order.create.mockResolvedValueOnce(mockCreatedOrder);
    mockPrisma.order.update.mockResolvedValueOnce({ ...mockCreatedOrder, status: 'PENDING_ADMIN_REVIEW' });
    mockPrisma.order.findUnique.mockResolvedValueOnce({ ...mockCreatedOrder, status: 'CART_SUBMITTED', invoices: [], payments: [], emails: [], orderItems: [] });
    mockPrisma.auditLog.create.mockResolvedValueOnce({});

    const res = await request(app)
      .post('/api/orders')
      .send(validOrderPayload);

    expect(res.status).toBe(201);
    expect(res.body.publicRef).toBeDefined();
  });

  it('retourne erreur si adultConfirmed est false', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ ...validOrderPayload, adultConfirmed: false });
    expect(res.status).toBe(400);
  });

  it('retourne erreur si termsAccepted est false', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ ...validOrderPayload, termsAccepted: false });
    expect(res.status).toBe(400);
  });

  it('retourne erreur si panier vide', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ ...validOrderPayload, items: [] });
    expect(res.status).toBe(400);
  });

  it('retourne erreur si email invalide', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ ...validOrderPayload, customerEmail: 'not-an-email' });
    expect(res.status).toBe(400);
  });

  it('retourne erreur si addressLine1 trop courte', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ ...validOrderPayload, addressLine1: 'AB' });
    expect(res.status).toBe(400);
  });

  it('retourne erreur si customerName manquant', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ ...validOrderPayload, customerName: 'A' });
    expect(res.status).toBe(400);
  });
});
