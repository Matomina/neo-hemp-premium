import type { ProductCategory } from "../types";

export type CategoryMeta = {
  id: string;
  name: string;
  slug: ProductCategory;
  description: string;
  image: string;
  accentColor: string;
  productCount: number;
  featuredSubcategories: string[];
};

export const categories: CategoryMeta[] = [
  {
    id: "cat-fleurs",
    name: "Fleurs CBD",
    slug: "fleurs",
    description: "Fleurs CBD premium aux profils aromatiques variés.",
    image: "/assets/categories/fleurs-cbd.svg",
    accentColor: "#5bff9a",
    productCount: 16,
    featuredSubcategories: ["Indoor", "Greenhouse", "Outdoor", "Small buds"],
  },
  {
    id: "cat-resines",
    name: "Résines CBD",
    slug: "resines",
    description: "Résines CBD blondes, brunes, pollen et filtrées.",
    image: "/assets/categories/resines-cbd.svg",
    accentColor: "#c07bff",
    productCount: 10,
    featuredSubcategories: [
      "Hash blond",
      "Hash brun",
      "Pollen",
      "Double filtre",
    ],
  },
  {
    id: "cat-concentres",
    name: "Concentrés CBD",
    slug: "concentres",
    description: "Concentrés CBD pour utilisateurs avertis.",
    image: "/assets/categories/concentres-cbd.svg",
    accentColor: "#7df9ff",
    productCount: 10,
    featuredSubcategories: ["Crumble", "Wax", "Shatter", "Isolat"],
  },
  {
    id: "cat-huiles",
    name: "Huiles CBD",
    slug: "huiles",
    description: "Huiles CBD en usage externe uniquement.",
    image: "/assets/categories/huiles-cbd.svg",
    accentColor: "#f6c76f",
    productCount: 10,
    featuredSubcategories: ["5%", "10%", "20%", "CBG"],
  },
  {
    id: "cat-cosmetiques",
    name: "Cosmétiques CBD",
    slug: "cosmetiques",
    description: "Soins cosmétiques CBD pour routine externe.",
    image: "/assets/categories/cosmetiques-cbd.svg",
    accentColor: "#ff8bd1",
    productCount: 10,
    featuredSubcategories: ["Crème", "Gel", "Baume", "Soin visage"],
  },
  {
    id: "cat-eliquides",
    name: "E-liquides CBD",
    slug: "eliquides",
    description: "E-liquides CBD sans nicotine et sans tabac.",
    image: "/assets/categories/eliquides-cbd.svg",
    accentColor: "#9d7bff",
    productCount: 10,
    featuredSubcategories: ["Menthe", "Fruits rouges", "Agrumes", "Tropical"],
  },
  {
    id: "cat-accessoires",
    name: "Accessoires",
    slug: "accessoires",
    description: "Accessoires de préparation, conservation et précision.",
    image: "/assets/categories/accessoires-cbd.svg",
    accentColor: "#5bff9a",
    productCount: 10,
    featuredSubcategories: [
      "Grinder",
      "Vaporisateur",
      "Conservation",
      "Balance",
    ],
  },
  {
    id: "cat-packs",
    name: "Packs CBD",
    slug: "packs",
    description: "Packs thématiques pour découvrir plusieurs références.",
    image: "/assets/categories/packs-cbd.svg",
    accentColor: "#c07bff",
    productCount: 10,
    featuredSubcategories: ["Découverte", "Premium", "Budget", "VIP"],
  },
  {
    id: "cat-animaux",
    name: "Animaux",
    slug: "animaux",
    description: "Références animaux en usage externe uniquement.",
    image: "/assets/categories/animaux-cbd.svg",
    accentColor: "#7df9ff",
    productCount: 10,
    featuredSubcategories: ["Chien", "Chat", "Senior", "Baume pattes"],
  },
];

export const getCategoryBySlug = (slug: ProductCategory) =>
  categories.find((category) => category.slug === slug);
