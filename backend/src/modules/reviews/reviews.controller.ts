import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';
import { CreateReviewSchema } from './reviews.schemas';
import { getProductReviews, createReview, getAverageRating } from './reviews.service';

export const getReviewsHandler: RequestHandler = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const [reviews, stats] = await Promise.all([
      getProductReviews(productId),
      getAverageRating(productId),
    ]);
    res.json({ reviews, stats });
  } catch (err) { next(err); }
};

export const createReviewHandler: RequestHandler = async (req, res, next) => {
  try {
    const data = CreateReviewSchema.parse(req.body);
    let userId: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const payload = jwt.verify(authHeader.slice(7), ENV.JWT_SECRET) as { sub: string };
        userId = payload.sub;
      } catch {}
    }
    const review = await createReview({ ...data, userId });
    res.status(201).json(review);
  } catch (err) { next(err); }
};
