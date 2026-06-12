import { apiClient } from './apiClient';

export interface OrderItemPayload {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface DraftOrderPayload {
  items: OrderItemPayload[];
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
