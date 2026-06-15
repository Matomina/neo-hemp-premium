import { describe, it, expect, beforeAll, vi } from 'vitest';
import type { Application } from 'express';
import request from 'supertest';
import { mockPrisma } from './mockPrisma';

vi.mock('../config/prisma', () => ({ prisma: mockPrisma }));

describe('GET /api/health', () => {
  let app: Application;

  beforeAll(async () => {
    const mod = await import('../app');
    app = mod.default;
  });

  it('répond 200 avec status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it("n'expose pas le JWT_SECRET", async () => {
    const res = await request(app).get('/api/health');
    const body = JSON.stringify(res.body);
    expect(body).not.toContain('test-secret');
    expect(body).not.toContain('JWT_SECRET');
  });

  it('indique que Stripe est désactivé', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.stripeEnabled).toBe(false);
  });

  it("retourne l'environnement de test", async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.env).toBe('test');
  });
});
