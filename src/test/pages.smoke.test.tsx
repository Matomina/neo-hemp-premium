import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock ENV avant tout import de composant
vi.mock('../config/env', () => ({
  ENV: { IS_MOCK: true, API_URL: '' },
}));

// Mock du contexte cart
vi.mock('../context', () => ({
  useCart: () => ({
    items: [],
    count: 0,
    total: 0,
    addToCart: vi.fn(),
    removeFromCart: vi.fn(),
    setQuantity: vi.fn(),
    clearCart: vi.fn(),
  }),
  CartProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock du contexte CustomerAuth
vi.mock('../context/CustomerAuthContext', () => ({
  useCustomerAuth: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
  CustomerAuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock du contexte AdminAuth
vi.mock('../context/admin/useAdminAuth', () => ({
  useAdminAuth: () => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    token: null,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

// Mock des hooks
vi.mock('../hooks/useScrollNavigate', () => ({
  useScrollNavigate: () => vi.fn(),
}));

vi.mock('../hooks/useScrollReveal', () => ({
  useScrollReveal: () => undefined,
}));

// Mock ordersApi
vi.mock('../services/ordersApi', () => ({
  ordersApi: {
    submit: vi.fn(),
    draft: vi.fn(),
    confirm: vi.fn(),
  },
}));

function renderPage(Component: React.ComponentType) {
  return render(
    React.createElement(MemoryRouter, null, React.createElement(Component)),
  );
}

describe('Pages smoke tests', () => {
  it('CartPage se rend sans crash', async () => {
    const { default: CartPage } = await import('../pages/CartPage');
    const { container } = renderPage(CartPage);
    expect(container).toBeInTheDocument();
  });

  it('LoginPage se rend sans crash', async () => {
    const { default: LoginPage } = await import('../pages/LoginPage');
    const { container } = renderPage(LoginPage);
    expect(container).toBeInTheDocument();
  });

  it('AdminLoginPage se rend sans crash', async () => {
    const { default: AdminLoginPage } = await import('../pages/admin/AdminLoginPage');
    const { container } = renderPage(AdminLoginPage);
    expect(container).toBeInTheDocument();
  });
});
