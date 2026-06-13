import { z } from 'zod';

export const CreateReviewSchema = z.object({
  productId: z.string().min(1),
  authorName: z.string().min(1).max(100),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(1000),
});
