import { prisma } from '../../config/prisma';

export async function getProductReviews(productId: string) {
  return prisma.review.findMany({
    where: { productId, isVisible: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      authorName: true,
      rating: true,
      comment: true,
      createdAt: true,
    },
  });
}

export async function createReview(data: {
  productId: string;
  userId?: string;
  authorName: string;
  rating: number;
  comment: string;
}) {
  return prisma.review.create({
    data,
    select: { id: true, authorName: true, rating: true, comment: true, createdAt: true },
  });
}

export async function getAverageRating(productId: string): Promise<{ average: number; count: number }> {
  const result = await prisma.review.aggregate({
    where: { productId, isVisible: true },
    _avg: { rating: true },
    _count: { id: true },
  });
  return { average: result._avg.rating ?? 0, count: result._count.id };
}
