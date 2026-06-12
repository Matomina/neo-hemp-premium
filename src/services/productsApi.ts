import { apiClient } from './apiClient';
import type { Product } from '../types';

export const productsApi = {
  getAll: () => apiClient.get<Product[]>('/api/products'),
  getBySlug: (slug: string) => apiClient.get<Product>(`/api/products/${slug}`),
  getCategories: () => apiClient.get<string[]>('/api/categories'),
};
