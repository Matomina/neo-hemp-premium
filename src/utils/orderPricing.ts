const FREE_SHIPPING_THRESHOLD = 49;
const STANDARD_SHIPPING = 4.9;

export function computeDisplayedShipping(subtotal: number) {
  if (subtotal <= 0) return 0;
  return subtotal < FREE_SHIPPING_THRESHOLD ? STANDARD_SHIPPING : 0;
}

export const ORDER_PRICING = {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING,
} as const;
