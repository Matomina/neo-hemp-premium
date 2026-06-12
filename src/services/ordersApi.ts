import { apiClient } from './apiClient';
import type { CartItem } from '../context/CartContext';

export interface DraftOrderPayload {
  items: CartItem[];
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
  city: string;
  country: string;
  adultConfirmed: boolean;
  termsAccepted: boolean;
}

export const ordersApi = {
  draft: (payload: DraftOrderPayload) => apiClient.post('/api/orders/draft', payload),
  confirm: (id: string) => apiClient.post(`/api/orders/${id}/confirm`, {}),
};
