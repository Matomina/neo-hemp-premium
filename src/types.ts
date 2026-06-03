export type CategorySlug = 'fleurs' | 'resines' | 'cosmetiques' | 'accessoires';

export type Product = {
  id: number;
  name: string;
  category: CategorySlug;
  label: string;
  price: number;
  cbdRate?: string;
  thcRate: string;
  origin: string;
  lot: string;
  imageTone: string;
  badges: string[];
  description: string;
};

export type CartItem = Product & {
  quantity: number;
};
