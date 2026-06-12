import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type { Product } from '../types';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  slug: string;
  category: string;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; id: string }
  | { type: 'SET_QTY'; id: string; qty: number }
  | { type: 'CLEAR' }
  | { type: 'INIT'; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.product.id);
      if (existing) {
        return { items: state.items.map(i => i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i) };
      }
      return { items: [...state.items, { id: action.product.id, name: action.product.name, price: action.product.price, quantity: 1, image: action.product.image, slug: action.product.slug, category: action.product.category }] };
    }
    case 'REMOVE':
      return { items: state.items.filter(i => i.id !== action.id) };
    case 'SET_QTY': {
      if (action.qty <= 0) return { items: state.items.filter(i => i.id !== action.id) };
      return { items: state.items.map(i => i.id === action.id ? { ...i, quantity: action.qty } : i) };
    }
    case 'CLEAR':
      return { items: [] };
    case 'INIT':
      return { items: action.items };
    default:
      return state;
  }
}

const STORAGE_KEY = 'cbd-cart-v1';

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) dispatch({ type: 'INIT', items: JSON.parse(stored) });
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = useCallback((product: Product) => dispatch({ type: 'ADD', product }), []);
  const removeFromCart = useCallback((id: string) => dispatch({ type: 'REMOVE', id }), []);
  const setQuantity = useCallback((id: string, qty: number) => dispatch({ type: 'SET_QTY', id, qty }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const count = useMemo(() => state.items.reduce((s, i) => s + i.quantity, 0), [state.items]);
  const total = useMemo(() => state.items.reduce((s, i) => s + i.price * i.quantity, 0), [state.items]);

  return (
    <CartContext.Provider value={{ items: state.items, count, total, addToCart, removeFromCart, setQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
