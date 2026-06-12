import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import type { Product } from '../types';
import type { CartItem } from './cartTypes';
import CartContext from './CartContext';
import { cartReducer } from './cartReducer';
import { STORAGE_KEY } from './cartTypes';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) dispatch({ type: 'INIT', items: JSON.parse(stored) as CartItem[] });
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
