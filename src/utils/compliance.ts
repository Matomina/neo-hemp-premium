import type { Product } from '../types';

export function isProductSellable(product: Product): boolean {
  return product.isSellable !== false && product.launchStatus !== 'compliance-review' && product.launchStatus !== 'coming-soon';
}

export function getComplianceBadge(product: Product): string | null {
  if (product.launchStatus === 'coming-soon') return 'Bientôt disponible';
  if (product.launchStatus === 'compliance-review') return 'En cours de validation';
  if (product.requiresComplianceReview) return 'Vérification en cours';
  return null;
}
