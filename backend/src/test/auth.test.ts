import { describe, it, expect, beforeAll, vi } from 'vitest';
import type { Application } from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { mockPrisma } from './mockPrisma';

vi.mock('../config/prisma', () => ({ prisma: mockPrisma }));

const mockUser = {
  id: 'user-test-id-1',
  email: 'admin@test.local',
  passwordHash: '$2b$10$testhashreallylong123456789012345678901234567890',
  role: 'ADMIN' as const,
  name: 'Admin Test',
  firstName: 'Admin',
  isActive: true,
  lastLoginAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastName: null,
  addresses: [],
  orders: [],
  auditLogs: [],
  reviews: [],
};

describe('Admin Auth Routes', () => {
  let app: Application;

  beforeAll(async () => {
    const mod = await import('../app');
    app = mod.default;
  });

  describe('POST /api/admin/auth/login', () => {
    it('retourne 400 si email invalide', async () => {
      const res = await request(app)
        .post('/api/admin/auth/login')
        .send({ email: 'not-an-email', password: 'password123' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('retourne 400 si password manquant', async () => {
      const res = await request(app)
        .post('/api/admin/auth/login')
        .send({ email: 'admin@test.local' });
      expect(res.status).toBe(400);
    });

    it('retourne 401 si user non trouvé', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const res = await request(app)
        .post('/api/admin/auth/login')
        .send({ email: 'nobody@test.local', password: 'wrongpassword' });
      expect(res.status).toBe(401);
    });

    it('retourne 401 si user trouvé mais pas ADMIN', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        ...mockUser,
        role: 'CUSTOMER',
      });
      const res = await request(app)
        .post('/api/admin/auth/login')
        .send({ email: 'customer@test.local', password: 'password123' });
      expect(res.status).toBe(401);
    });

    it('retourne 403 si compte désactivé', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        ...mockUser,
        isActive: false,
      });
      const res = await request(app)
        .post('/api/admin/auth/login')
        .send({ email: 'admin@test.local', password: 'password123' });
      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/admin/auth/me', () => {
    it('retourne 401 sans token', async () => {
      const res = await request(app).get('/api/admin/auth/me');
      expect(res.status).toBe(401);
    });

    it('retourne 401 avec token invalide', async () => {
      const res = await request(app)
        .get('/api/admin/auth/me')
        .set('Authorization', 'Bearer invalid-token');
      expect(res.status).toBe(401);
    });

    it('retourne 200 avec token valide et user ADMIN', async () => {
      const token = jwt.sign(
        { sub: mockUser.id, email: mockUser.email, role: 'ADMIN' },
        process.env['JWT_SECRET']!,
        { expiresIn: '1h' },
      );
      mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);

      const res = await request(app)
        .get('/api/admin/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.email).toBe(mockUser.email);
    });
  });

  describe('Route protégée sans token', () => {
    it('GET /api/admin/dashboard retourne 401 sans token', async () => {
      const res = await request(app).get('/api/admin/dashboard');
      expect(res.status).toBe(401);
    });
  });
});
