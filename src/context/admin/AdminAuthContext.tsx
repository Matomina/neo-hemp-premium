import { useCallback, useEffect, useState } from 'react';
import type { AdminUser } from './adminAuthTypes';
import { ADMIN_TOKEN_KEY } from './adminAuthTypes';
import { AdminAuthContext } from './createAdminAuthContext';
import { ENV } from '../../config/env';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY));
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(localStorage.getItem(ADMIN_TOKEN_KEY)));

  useEffect(() => {
    if (!token) { return; }
    fetch(`${ENV.API_URL}/api/admin/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((u: AdminUser) => setUser(u))
      .catch(() => { setToken(null); setUser(null); localStorage.removeItem(ADMIN_TOKEN_KEY); })
      .finally(() => setIsLoading(false));
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${ENV.API_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur de connexion' }));
      throw new Error(err.error ?? 'Identifiants incorrects');
    }
    const data = await res.json() as { token: string; user: AdminUser };
    localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ user, token, isLoading, isAuthenticated: Boolean(user), login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
