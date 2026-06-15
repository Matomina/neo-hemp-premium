import { describe, it, expect, beforeAll, vi } from 'vitest';
import type { Application } from 'express';
import request from 'supertest';
import { mockPrisma } from './mockPrisma';

vi.mock('../config/prisma', () => ({ prisma: mockPrisma }));

const validContactPayload = {
  name: 'Marie Martin',
  email: 'marie@test.fr',
  subject: 'Question sur les produits',
  message: 'Bonjour, je voudrais en savoir plus sur vos fleurs CBD.',
};

const mockContact = {
  id: 'contact-test-id-1',
  name: validContactPayload.name,
  email: validContactPayload.email,
  subject: validContactPayload.subject,
  message: validContactPayload.message,
  phone: null,
  status: 'NEW',
  adminNotes: null,
  isRead: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('POST /api/contact', () => {
  let app: Application;

  beforeAll(async () => {
    const mod = await import('../app');
    app = mod.default;
  });

  it('crée un message de contact valide et retourne 201', async () => {
    mockPrisma.contactMessage.create.mockResolvedValueOnce(mockContact);

    const res = await request(app)
      .post('/api/contact')
      .send(validContactPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('retourne erreur si email invalide', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ ...validContactPayload, email: 'invalid-email' });
    expect(res.status).toBe(400);
  });

  it('retourne erreur si message trop court (< 10 chars)', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ ...validContactPayload, message: 'Court' });
    expect(res.status).toBe(400);
  });

  it('retourne erreur si name trop court (< 2 chars)', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ ...validContactPayload, name: 'A' });
    expect(res.status).toBe(400);
  });

  it('retourne erreur si email manquant', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Marie Martin', message: 'Un message assez long pour la validation.' });
    expect(res.status).toBe(400);
  });

  it('retourne erreur si name manquant', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ email: 'marie@test.fr', message: 'Un message assez long pour la validation.' });
    expect(res.status).toBe(400);
  });

  it('retourne erreur si message manquant', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Marie Martin', email: 'marie@test.fr' });
    expect(res.status).toBe(400);
  });
});
