import type { CartState, CartAction } from './cartTypes';

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.product.id);
      if (existing) {
        return { items: state.items.map(i => i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i) };
      }
      return {
        items: [...state.items, {
          id: action.product.id,
          name: action.product.name,
          price: action.product.price,
          quantity: 1,
          image: action.product.image,
          slug: action.product.slug,
          category: action.product.category,
        }],
      };
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
