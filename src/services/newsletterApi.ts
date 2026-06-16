import { apiClient } from './apiClient';

export const newsletterApi = {
  subscribe: (email: string) => apiClient.post('/api/newsletter', { email }),
};
