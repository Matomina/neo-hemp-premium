import { apiClient } from './apiClient';
import { ENV } from '../config/env';

export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export const contactApi = {
  send: (payload: ContactPayload) => {
    if (ENV.IS_MOCK) {
      // Mode démo — votre message n'a pas été envoyé.
      return Promise.resolve({ mock: true });
    }
    return apiClient.post('/api/contact', payload);
  },
};
