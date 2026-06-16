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

export interface OrderResponse {
  id: string;
  publicRef: string;
  customerEmail: string;
  customerName: string;
  status: string;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

export const ordersApi = {
  submit: (payload: DraftOrderPayload) => apiClient.post<OrderResponse>('/api/orders', payload),
  draft: (payload: DraftOrderPayload) => apiClient.post<OrderResponse>('/api/orders/draft', payload),
  confirm: (id: string) => apiClient.post<OrderResponse>(`/api/orders/${id}/confirm`, {}),
};
