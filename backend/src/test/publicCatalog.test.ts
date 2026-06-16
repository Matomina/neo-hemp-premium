import { describe, it, expect, beforeAll, vi } from 'vitest';
import type { Application } from 'express';
import request from 'supertest';
import { mockPrisma } from './mockPrisma';

vi.mock('../config/prisma', () => ({ prisma: mockPrisma }));

describe('Public catalog routes', () => {
  let app: Application;

  beforeAll(async () => {
    const mod = await import('../app');
    app = mod.default;
  });

  it('retourne 404 pour un produit public non exposable', async () => {
    mockPrisma.product.findFirst.mockResolvedValueOnce(null);

    const res = await request(app).get('/api/products/produit-cache');

    expect(res.status).toBe(404);
    expect(mockPrisma.product.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        slug: 'produit-cache',
        isActive: true,
        isSellable: true,
        launchStatus: 'ACTIVE',
      }),
    }));
  });

  it('retourne 404 pour les certificats d’un produit non public', async () => {
    mockPrisma.product.findFirst.mockResolvedValueOnce(null);

    const res = await request(app).get('/api/certificates/produit-cache');

    expect(res.status).toBe(404);
  });

  it('n’expose publiquement que les certificats validés d’un produit public', async () => {
    mockPrisma.product.findFirst.mockResolvedValueOnce({
      id: 'prod-1',
      slug: 'produit-public',
      certificates: [{ id: 'cert-1', status: 'VALIDATED', fileUrl: '/cert-1.pdf' }],
    });

    const res = await request(app).get('/api/products/produit-public');

    expect(res.status).toBe(200);
    expect(res.body.certificates).toEqual([{ id: 'cert-1', status: 'VALIDATED', fileUrl: '/cert-1.pdf' }]);
    expect(mockPrisma.product.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      include: {
        certificates: {
          where: { status: 'VALIDATED' },
        },
      },
    }));
  });
});
