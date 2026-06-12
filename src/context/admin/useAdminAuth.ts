import { useContext } from 'react';
import type { AdminAuthContextValue } from './adminAuthTypes';
import { AdminAuthContext } from './createAdminAuthContext';

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
