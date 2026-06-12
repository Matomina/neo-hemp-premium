import { ENV } from '../config/env';
import { ADMIN_TOKEN_KEY } from '../context/admin/adminAuthTypes';

function getToken(): string {
  return localStorage.getItem(ADMIN_TOKEN_KEY) ?? '';
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${ENV.API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Dashboard ────────────────────────────────────────────────────────────────
export const getDashboardSummary = () => adminFetch<Record<string, unknown>>('/api/admin/dashboard/summary');
export const getDashboardActivity = () => adminFetch<Record<string, unknown>>('/api/admin/dashboard/activity');

// ── Quotes ───────────────────────────────────────────────────────────────────
export const listQuotes = (page = 1) => adminFetch<{ items: unknown[]; total: number }>(`/api/quotes/admin?page=${page}`);
export const getQuote = (id: string) => adminFetch<Record<string, unknown>>(`/api/quotes/admin/${id}`);
export const updateQuote = (id: string, body: object) => adminFetch<Record<string, unknown>>(`/api/quotes/admin/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
export const approveQuote = (id: string) => adminFetch<Record<string, unknown>>(`/api/quotes/admin/${id}/approve`, { method: 'POST' });
export const sendQuotePayment = (id: string) => adminFetch<Record<string, unknown>>(`/api/quotes/admin/${id}/send-payment`, { method: 'POST' });
export const cancelQuote = (id: string) => adminFetch<Record<string, unknown>>(`/api/quotes/admin/${id}/cancel`, { method: 'POST' });

// ── Orders ───────────────────────────────────────────────────────────────────
export const listOrders = (page = 1) => adminFetch<{ items: unknown[]; total: number }>(`/api/orders/admin?page=${page}`);
export const getOrder = (id: string) => adminFetch<Record<string, unknown>>(`/api/orders/admin/${id}`);
export const updateOrder = (id: string, body: object) => adminFetch<Record<string, unknown>>(`/api/orders/admin/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
export const approveOrder = (id: string) => adminFetch<Record<string, unknown>>(`/api/orders/admin/${id}/approve`, { method: 'POST' });
export const sendOrderPayment = (id: string) => adminFetch<Record<string, unknown>>(`/api/orders/admin/${id}/send-payment`, { method: 'POST' });
export const cancelOrder = (id: string) => adminFetch<Record<string, unknown>>(`/api/orders/admin/${id}/cancel`, { method: 'POST' });

// ── Contacts ─────────────────────────────────────────────────────────────────
export const listContacts = (page = 1) => adminFetch<{ items: unknown[]; total: number }>(`/api/contact/admin?page=${page}`);
export const getContact = (id: string) => adminFetch<Record<string, unknown>>(`/api/contact/admin/${id}`);
export const updateContact = (id: string, body: object) => adminFetch<Record<string, unknown>>(`/api/contact/admin/${id}`, { method: 'PATCH', body: JSON.stringify(body) });

// ── Invoices ─────────────────────────────────────────────────────────────────
export const listInvoices = (page = 1) => adminFetch<{ items: unknown[]; total: number }>(`/api/admin/invoices?page=${page}`);
export const getInvoice = (id: string) => adminFetch<Record<string, unknown>>(`/api/admin/invoices/${id}`);
export const regeneratePdf = (id: string) => adminFetch<Record<string, unknown>>(`/api/admin/invoices/${id}/regenerate-pdf`, { method: 'POST' });
export async function downloadInvoicePdf(id: string): Promise<void> {
  const res = await fetch(`${ENV.API_URL}/api/admin/invoices/${id}/pdf`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `facture-${id}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Payments ──────────────────────────────────────────────────────────────────
export const listPayments = (page = 1) => adminFetch<{ items: unknown[]; total: number }>(`/api/admin/payments?page=${page}`);
export const getPayment = (id: string) => adminFetch<Record<string, unknown>>(`/api/admin/payments/${id}`);
