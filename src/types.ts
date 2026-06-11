export type ProductCategory =
  | 'fleurs'
  | 'resines'
  | 'concentres'
  | 'huiles'
  | 'cosmetiques'
  | 'eliquides'
  | 'accessoires'
  | 'packs'
  | 'animaux';

// Backward compat alias — same type
export type CategorySlug = ProductCategory;

export type ProductTone = 'emerald' | 'violet' | 'gold' | 'silver' | 'cyan' | 'dark';

export type CultureType = 'Indoor' | 'Greenhouse' | 'Outdoor';

export type Product = {
  // ── Core (new schema)
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  subcategory?: string;
  badge?: string;
  brand?: string;
  image: string;
  gallery?: string[];
  price: number;
  oldPrice?: number;
  cbdRate?: string;
  cbgRate?: string;
  cbnRate?: string;
  thc?: '< 0,3%';
  culture?: CultureType;
  origin?: string;
  format?: string;
  flavors?: string[];
  shortDescription: string;
  description: string;
  highlights: string[];
  usageNote?: string;
  complianceNote?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  // ── Legacy fields (kept for backward compat with render code)
  label?: string;
  imageTone?: ProductTone;
  imageAlt?: string;
  badges?: string[];
  cbdPercent?: number;
  thcRate?: string;
  lot?: string;
  certificateAvailable?: boolean;
  details?: string;
  composition?: string;
  precautions?: string;
};

export type CartItem = Product & {
  quantity: number;
};

export type RouteKey =
  | 'home' | 'shop' | 'category' | 'product' | 'cart' | 'checkout'
  | 'confirmation' | 'account' | 'login' | 'about' | 'guide'
  | 'certificates' | 'faq' | 'contact' | 'shipping' | 'legal'
  | 'terms' | 'privacy' | 'cookies' | 'withdrawal';

export type AppRoute = {
  key: RouteKey;
  path: string;
  label: string;
};
