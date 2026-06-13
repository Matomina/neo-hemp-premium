import { ENV } from '../config/env';

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewStats {
  average: number;
  count: number;
}

export interface ReviewsResponse {
  reviews: Review[];
  stats: ReviewStats;
}

export interface CreateReviewPayload {
  productId: string;
  authorName: string;
  rating: number;
  comment: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${ENV.API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message ?? `Erreur ${res.status}`);
  return data as T;
}

export const reviewsApi = {
  getByProduct(productId: string): Promise<ReviewsResponse> {
    return request(`/api/reviews/${productId}`);
  },

  create(payload: CreateReviewPayload, token?: string): Promise<Review> {
    return request('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};
