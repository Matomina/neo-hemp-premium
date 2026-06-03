export type CategorySlug = 'fleurs' | 'resines' | 'cosmetiques' | 'accessoires';

export type ProductTone = 'emerald' | 'violet' | 'gold' | 'silver' | 'cyan' | 'dark';

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: CategorySlug;
  label: string;
  price: number;
  cbdRate?: string;
  cbdPercent?: number;
  thcRate: string;
  origin: string;
  lot: string;
  imageTone: ProductTone;
  imageAlt: string;
  badges: string[];
  description: string;
  details: string;
  composition: string;
  precautions: string;
  certificateAvailable: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
};

export type CartItem = Product & {
  quantity: number;
};

export type RouteKey =
  | 'home'
  | 'shop'
  | 'category'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'confirmation'
  | 'account'
  | 'login'
  | 'about'
  | 'guide'
  | 'certificates'
  | 'faq'
  | 'contact'
  | 'shipping'
  | 'legal'
  | 'terms'
  | 'privacy'
  | 'cookies'
  | 'withdrawal';

export type AppRoute = {
  key: RouteKey;
  path: string;
  label: string;
};
