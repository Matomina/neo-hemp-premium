import type { Product } from '../types';

export type SortOption = 'popularity' | 'newest' | 'price-asc' | 'price-desc';

export interface FilterState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  certOnly: boolean;
  newOnly: boolean;
  bestSellerOnly: boolean;
  inStockOnly: boolean;
  sort: SortOption;
}

export const DEFAULT_FILTERS: FilterState = {
  search: '',
  category: 'all',
  minPrice: 0,
  maxPrice: 9999,
  certOnly: false,
  newOnly: false,
  bestSellerOnly: false,
  inStockOnly: false,
  sort: 'popularity',
};

export function applyFilters(products: Product[], filters: FilterState): Product[] {
  let result = [...products];
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q));
  }
  if (filters.category !== 'all') {
    result = result.filter(p => p.category === filters.category);
  }
  result = result.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);
  if (filters.certOnly) result = result.filter(p => p.certificateAvailable);
  if (filters.newOnly) result = result.filter(p => p.isNew);
  if (filters.bestSellerOnly) result = result.filter(p => p.isBestSeller);
  if (filters.inStockOnly) result = result.filter(p => !p.stock || p.stock > 0);
  switch (filters.sort) {
    case 'price-asc': result.sort((a, b) => a.price - b.price); break;
    case 'price-desc': result.sort((a, b) => b.price - a.price); break;
    case 'newest': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    case 'popularity': result.sort((a, b) => ((b.popularityScore ?? 0) - (a.popularityScore ?? 0)) || (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)); break;
  }
  return result;
}
