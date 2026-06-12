import { apiClient } from './apiClient';

export interface QuoteItem {
  name: string;
  quantity: number;
  unitCents: number;
  totalCents: number;
}

export interface CreateQuotePayload {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  clientMessage?: string;
  simulatorPayload?: Record<string, unknown>;
  items: QuoteItem[];
  shippingCents?: number;
  taxCents?: number;
}

export const quotesApi = {
  create: (payload: CreateQuotePayload) =>
    apiClient.post<{ id: string; publicRef: string; totalCents: number }>('/api/quotes', payload),
};
