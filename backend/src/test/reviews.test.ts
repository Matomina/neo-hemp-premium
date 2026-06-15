import { describe, it, expect, beforeAll, vi } from 'vitest';
import type { Application } from 'express';
import request from 'supertest';
import { mockPrisma } from './mockPrisma';

vi.mock('../config/prisma', () => ({ prisma: mockPrisma }));

const mockReviews = [
  {
    id: 'review-1',
    authorName: 'Sophie',
    rating: 5,
    comment: 'Excellent produit, très satisfaite!',
    createdAt: new Date(),
  },
  {
    id: 'review-2',
    authorName: 'Pierre',
    rating: 4,
    comment: 'Bonne qualité, livraison rapide.',
    createdAt: new Date(),
  },
];

const mockAggregateResult = {
  _avg: { rating: 4.5 },
  _count: { id: 2 },
};

describe('Reviews Routes', () => {
  let app: Application;

  beforeAll(async () => {
    const mod = await import('../app');
    app = mod.default;
  });

  describe('GET /api/reviews/:productId', () => {
    it('retourne les avis et les stats du produit', async () => {
      mockPrisma.review.findMany.mockResolvedValueOnce(mockReviews);
      mockPrisma.review.aggregate.mockResolvedValueOnce(mockAggregateResult);

      const res = await request(app).get('/api/reviews/prod-fleur-cbd-1');
      expect(res.status).toBe(200);
      expect(res.body.reviews).toHaveLength(2);
      expect(res.body.stats).toBeDefined();
      expect(res.body.stats.average).toBeCloseTo(4.5);
      expect(res.body.stats.count).toBe(2);
    });

    it('retourne reviews vides si pas de données', async () => {
      mockPrisma.review.findMany.mockResolvedValueOnce([]);
      mockPrisma.review.aggregate.mockResolvedValueOnce({
        _avg: { rating: null },
        _count: { id: 0 },
      });

      const res = await request(app).get('/api/reviews/prod-inexistant');
      expect(res.status).toBe(200);
      expect(res.body.reviews).toHaveLength(0);
      expect(res.body.stats.count).toBe(0);
    });
  });

  describe('POST /api/reviews', () => {
    it('crée un avis valide et retourne 201', async () => {
      const newReview = {
        id: 'review-new-1',
        authorName: 'Alice',
        rating: 5,
        comment: 'Super produit, je recommande!',
        createdAt: new Date(),
      };
      mockPrisma.review.create.mockResolvedValueOnce(newReview);

      const res = await request(app)
        .post('/api/reviews')
        .send({
          productId: 'prod-fleur-cbd-1',
          authorName: 'Alice',
          rating: 5,
          comment: 'Super produit, je recommande!',
        });

      expect(res.status).toBe(201);
      expect(res.body.rating).toBe(5);
    });

    it('retourne erreur si rating invalide (> 5)', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .send({
          productId: 'prod-1',
          authorName: 'Alice',
          rating: 6,
          comment: 'Super produit, je recommande!',
        });
      expect(res.status).toBe(400);
    });

    it('retourne erreur si rating zéro', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .send({
          productId: 'prod-1',
          authorName: 'Alice',
          rating: 0,
          comment: 'Super produit, je recommande!',
        });
      expect(res.status).toBe(400);
    });

    it('retourne erreur si commentaire trop court (< 5 chars)', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .send({
          productId: 'prod-1',
          authorName: 'Alice',
          rating: 4,
          comment: 'Ok',
        });
      expect(res.status).toBe(400);
    });

    it('retourne erreur si productId manquant', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .send({
          authorName: 'Alice',
          rating: 4,
          comment: 'Super produit CBD!',
        });
      expect(res.status).toBe(400);
    });

    it('retourne erreur si authorName manquant', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .send({
          productId: 'prod-1',
          rating: 4,
          comment: 'Super produit CBD!',
        });
      expect(res.status).toBe(400);
    });
  });
});
