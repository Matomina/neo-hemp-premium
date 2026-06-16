import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { authApi, type AuthUser } from '../services/authApi';
import { ENV } from '../config/env';

interface CustomerAuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login(email: string, password: string): Promise<void>;
  register(email: string, password: string, firstName?: string, lastName?: string): Promise<void>;
  logout(): void;
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

const TOKEN_KEY = 'cbd-customer-token';

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    return !!stored && !ENV.IS_MOCK;
  });
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored || ENV.IS_MOCK) return;
    authApi.me(stored)
      .then(u => { setUser(u); setIsLoading(false); })
      .catch(() => { localStorage.removeItem(TOKEN_KEY); setToken(null); setIsLoading(false); });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token: t, user: u } = await authApi.login(email, password);
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setUser(u);
  }, []);

  const register = useCallback(async (email: string, password: string, firstName?: string, lastName?: string) => {
    const { token: t, user: u } = await authApi.register(email, password, firstName, lastName);
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <CustomerAuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  return ctx;
}
