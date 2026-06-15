import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { CartProvider } from '../context/CartProvider';
import { useCart } from '../context/useCart';
import type { Product } from '../types';

// Mock product pour les tests
const mockProduct: Product = {
  id: 'test-id-1',
  name: 'Fleur CBD Test',
  price: 9.90,
  slug: 'fleur-cbd-test',
  category: 'fleurs',
  shortDescription: 'Test produit',
  description: 'Description de test',
  highlights: [],
  image: '/test.png',
};

const mockProduct2: Product = {
  id: 'test-id-2',
  name: 'Résine CBD Test',
  price: 14.90,
  slug: 'resine-cbd-test',
  category: 'resines',
  shortDescription: 'Test produit 2',
  description: 'Description de test 2',
  highlights: [],
  image: '/test2.png',
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  React.createElement(CartProvider, null, children)
);

describe('Cart Context', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('démarre avec un panier vide', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.count).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('ajoute un produit au panier', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(mockProduct);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.count).toBe(1);
    expect(result.current.total).toBeCloseTo(9.90);
  });

  it('incrémente la quantité si le même produit est ajouté', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart(mockProduct);
    });
    expect(result.current.count).toBe(2);
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('supprime un produit du panier', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(mockProduct);
    });
    expect(result.current.items).toHaveLength(1);
    act(() => {
      result.current.removeFromCart('test-id-1');
    });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.count).toBe(0);
  });

  it('modifie la quantité avec setQuantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(mockProduct);
    });
    act(() => {
      result.current.setQuantity('test-id-1', 3);
    });
    expect(result.current.count).toBe(3);
    expect(result.current.total).toBeCloseTo(9.90 * 3);
  });

  it('supprime si quantité mise à 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(mockProduct);
    });
    act(() => {
      result.current.setQuantity('test-id-1', 0);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it('supprime si quantité négative', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(mockProduct);
    });
    act(() => {
      result.current.setQuantity('test-id-1', -1);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it('vide le panier avec clearCart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart(mockProduct2);
    });
    expect(result.current.items).toHaveLength(2);
    act(() => {
      result.current.clearCart();
    });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.count).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('calcule correctement le total avec plusieurs produits', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart(mockProduct);
      result.current.addToCart(mockProduct2);
    });
    expect(result.current.items).toHaveLength(2);
    expect(result.current.count).toBe(3);
    expect(result.current.total).toBeCloseTo(9.90 * 2 + 14.90);
  });

  it('ne modifie pas un produit qui n\'existe pas dans le panier', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(mockProduct);
    });
    act(() => {
      result.current.setQuantity('non-existent-id', 5);
    });
    // The non-existent item gets ignored
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(1);
  });
});

describe('cartReducer isolé', () => {
  it('useCart lève une erreur si utilisé hors du provider', () => {
    expect(() => renderHook(() => useCart())).toThrow('useCart must be used within CartProvider');
  });
});
