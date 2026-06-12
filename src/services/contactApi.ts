import { apiClient } from './apiClient';

export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export const contactApi = {
  send: (payload: ContactPayload) => apiClient.post('/api/contact', payload),
};
