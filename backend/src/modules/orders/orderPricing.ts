const FREE_SHIPPING_THRESHOLD_CENTS = 4900;
const STANDARD_SHIPPING_CENTS = 490;

export interface PricingItemInput {
  price: number;
  quantity: number;
}

export function computeOrderPricing(items: PricingItemInput[]) {
  const subtotalCents = items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0);
  const shippingCents = subtotalCents > 0 && subtotalCents < FREE_SHIPPING_THRESHOLD_CENTS ? STANDARD_SHIPPING_CENTS : 0;
  const totalCents = subtotalCents + shippingCents;

  return {
    subtotalCents,
    shippingCents,
    totalCents,
  };
}

export const ORDER_PRICING = {
  FREE_SHIPPING_THRESHOLD_CENTS,
  STANDARD_SHIPPING_CENTS,
} as const;
