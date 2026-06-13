import { ENV } from '../config/env';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const res = await fetch(`${ENV.API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message ?? `Erreur ${res.status}`);
  return data as T;
}

export const authApi = {
  register(email: string, password: string, firstName?: string, lastName?: string): Promise<AuthResponse> {
    return request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
  },

  login(email: string, password: string): Promise<AuthResponse> {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  me(token: string): Promise<AuthUser> {
    return request('/api/auth/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
