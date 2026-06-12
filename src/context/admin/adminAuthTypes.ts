export interface AdminUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export interface AdminAuthState {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
}

export interface AdminAuthContextValue extends AdminAuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const ADMIN_TOKEN_KEY = 'cbd-admin-token';
