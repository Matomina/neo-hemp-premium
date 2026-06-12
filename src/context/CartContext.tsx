import { createContext } from 'react';
import type { CartContextValue } from './cartTypes';

const CartContext = createContext<CartContextValue | null>(null);

export default CartContext;
