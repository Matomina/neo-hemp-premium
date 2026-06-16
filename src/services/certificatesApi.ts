import { apiClient } from './apiClient';

export const certificatesApi = {
  getBySlug: (slug: string) => apiClient.get(`/api/certificates/${slug}`),
};
