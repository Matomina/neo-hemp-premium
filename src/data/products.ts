import type { Product, ProductCategory, CultureType } from "../types";

export const categoryLabels: Record<ProductCategory, string> = {
  fleurs: "Fleurs CBD",
  resines: "Résines CBD",
  concentres: "Concentrés CBD",
  huiles: "Huiles CBD",
  cosmetiques: "Cosmétiques CBD",
  eliquides: "E-liquides CBD",
  accessoires: "Accessoires",
  packs: "Packs CBD",
  animaux: "Animaux",
};

export const categoryDescriptions: Record<ProductCategory, string> = {
  fleurs:
    "Fleurs CBD premium aux profils aromatiques variés, sélectionnées avec une approche responsable et conforme.",
  resines:
    "Résines CBD blondes, brunes et pollen, pensées pour une expérience sensorielle sobre, qualitative et traçable.",
  concentres:
    "Concentrés CBD pour utilisateurs avertis, avec une information claire, responsable et conforme.",
  huiles:
    "Huiles CBD présentées en usage externe uniquement, avec des formats progressifs et une information prudente.",
  cosmetiques:
    "Cosmétiques CBD pour routines externes, avec une présentation premium et sans promesse médicale.",
  eliquides:
    "E-liquides CBD sans nicotine et sans tabac, avec des profils aromatiques clairs et responsables.",
  accessoires:
    "Accessoires de préparation, conservation et précision pour compléter le parcours boutique.",
  packs:
    "Packs thématiques pour découvrir plusieurs références avec une sélection simple et premium.",
  animaux:
    "Références animaux en usage externe uniquement, présentées avec prudence et sans promesse médicale.",
};

type ProductSeed = {
  id: string;
  name: string;
  category: ProductCategory;
  subcategory?: string;
  badge?: string;
  image: string;
  price: number;
  oldPrice?: number;
  cbdRate?: string;
  cbgRate?: string;
  cbnRate?: string;
  culture?: CultureType;
  origin?: string;
  format?: string;
  flavors?: string[];
  shortDescription: string;
  description: string;
  highlights: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
};

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const getComplianceNote = (category: ProductCategory) => {
  if (category === "eliquides") {
    return "Sans nicotine. Sans tabac. Produit réservé aux adultes.";
  }

  if (
    category === "huiles" ||
    category === "cosmetiques" ||
    category === "animaux"
  ) {
    return "Usage externe uniquement. Produit réservé aux adultes.";
  }

  if (category === "accessoires" || category === "packs") {
    return "Produit réservé aux adultes. Vérifier les conditions légales applicables.";
  }

  return "Produit réservé aux adultes. Taux de THC inférieur à 0,3%.";
};

const getUsageNote = (category: ProductCategory) => {
  if (
    category === "huiles" ||
    category === "cosmetiques" ||
    category === "animaux"
  ) {
    return "Usage externe uniquement. Ne pas avaler. Tenir hors de portée des enfants.";
  }

  return undefined;
};

const getSeedImage = (seed: ProductSeed) => {
  if (seed.image.startsWith("/assets/products/")) {
    return `/products/${seed.category}/${slugify(seed.name)}.png`;
  }

  return seed.image;
};

const createProduct = (seed: ProductSeed): Product => {
  const image = getSeedImage(seed);

  return {
    id: seed.id,
    name: seed.name,
    slug: slugify(seed.name),
    category: seed.category,
    subcategory: seed.subcategory,
    badge: seed.badge,
    brand: "Neo Hemp Premium",
    image,
    gallery: [image],
    price: seed.price,
    oldPrice: seed.oldPrice,
    cbdRate: seed.cbdRate,
    cbgRate: seed.cbgRate,
    cbnRate: seed.cbnRate,
    thc:
      seed.category === "fleurs" ||
      seed.category === "resines" ||
      seed.category === "concentres"
        ? "< 0,3%"
        : undefined,
    culture: seed.culture,
    origin: seed.origin,
    format: seed.format,
    flavors: seed.flavors,
    shortDescription: seed.shortDescription,
    description: seed.description,
    highlights: seed.highlights,
    usageNote: getUsageNote(seed.category),
    complianceNote: getComplianceNote(seed.category),
    isFeatured: seed.isFeatured,
    isNew: seed.isNew,
    isBestSeller: seed.isBestSeller,

    // Compatibilité avec l'ancien affichage existant
    label: seed.cbdRate ?? seed.badge,
    imageAlt: `${seed.name} - ${categoryLabels[seed.category]}`,
    badges: seed.highlights,
    thcRate:
      seed.category === "fleurs" ||
      seed.category === "resines" ||
      seed.category === "concentres"
        ? "< 0,3%"
        : undefined,
    certificateAvailable:
      seed.category !== "accessoires" && seed.category !== "packs",
    details: seed.description,
    composition:
      seed.category === "eliquides"
        ? "Base e-liquide CBD, arômes, sans nicotine, sans tabac."
        : seed.category === "accessoires"
          ? "Composition variable selon la référence."
          : "Chanvre issu de variétés autorisées. Fiche lot à vérifier avant publication.",
    precautions:
      seed.category === "huiles" ||
      seed.category === "cosmetiques" ||
      seed.category === "animaux"
        ? "Usage externe uniquement. Ne pas avaler. Éviter le contact avec les yeux."
        : "Produit réservé aux adultes. Conserver dans un endroit sec, à l’abri de la lumière.",
  };
};

const seeds: ProductSeed[] = [
  // Fleurs CBD — 16 produits
  {
    id: "fl-001",
    name: "Amnesia Indoor CBD",
    category: "fleurs",
    subcategory: "Indoor",
    badge: "Best-seller",
    image: "/assets/products/fleurs-cbd.svg",
    price: 8.9,
    oldPrice: 10.9,
    cbdRate: "12%",
    culture: "Indoor",
    origin: "Italie",
    flavors: ["agrumes", "pin", "herbacé"],
    shortDescription: "Fleur CBD indoor au profil agrumes et végétal.",
    description:
      "Amnesia Indoor CBD propose un profil aromatique vif, entre notes d’agrumes, touches végétales et finition légèrement résineuse. Sa sélection met l’accent sur une présentation premium, une traçabilité claire et une fiche produit responsable.",
    highlights: ["Culture indoor", "Profil agrumes", "THC < 0,3%"],
    isFeatured: true,
    isBestSeller: true,
  },
  {
    id: "fl-002",
    name: "Lemon Haze CBD",
    category: "fleurs",
    subcategory: "Indoor",
    badge: "Premium",
    image: "/assets/products/fleurs-cbd.svg",
    price: 9.4,
    cbdRate: "13%",
    culture: "Indoor",
    origin: "Suisse",
    flavors: ["citron", "zeste", "floral"],
    shortDescription: "Fleur CBD citronnée, fraîche et lumineuse.",
    description:
      "Lemon Haze CBD met en avant une identité fraîche et citronnée, avec des notes de zeste et une base florale. Elle s’intègre dans une sélection premium orientée qualité, lisibilité et conformité.",
    highlights: ["Notes citronnées", "Sélection premium", "THC < 0,3%"],
    isFeatured: true,
  },
  {
    id: "fl-003",
    name: "Gelato CBD",
    category: "fleurs",
    subcategory: "Indoor",
    badge: "Nouveau",
    image: "/assets/products/fleurs-cbd.svg",
    price: 9.9,
    cbdRate: "14%",
    culture: "Indoor",
    origin: "Italie",
    flavors: ["crémeux", "fruité", "doux"],
    shortDescription: "Fleur CBD douce, fruitée et crémeuse.",
    description:
      "Gelato CBD développe un profil sensoriel rond, mêlant notes fruitées, douceur crémeuse et présentation soignée. La fiche reste centrée sur l’aromatique, la qualité de sélection et la conformité.",
    highlights: ["Profil gourmand", "Indoor", "THC < 0,3%"],
    isNew: true,
  },
  {
    id: "fl-004",
    name: "Purple Queen CBD",
    category: "fleurs",
    subcategory: "Indoor",
    image: "/assets/products/fleurs-cbd.svg",
    price: 9.8,
    cbdRate: "12%",
    culture: "Indoor",
    origin: "France",
    flavors: ["fruits noirs", "floral", "terreux"],
    shortDescription: "Fleur CBD florale aux notes de fruits noirs.",
    description:
      "Purple Queen CBD se distingue par une signature aromatique florale et fruitée, avec une nuance plus profonde en fin de profil. Une référence premium pensée pour enrichir le catalogue sans promesse médicale.",
    highlights: ["Notes fruits noirs", "Origine France", "THC < 0,3%"],
  },
  {
    id: "fl-005",
    name: "Mango Kush CBD",
    category: "fleurs",
    subcategory: "Indoor",
    image: "/assets/products/fleurs-cbd.svg",
    price: 9.2,
    cbdRate: "11%",
    culture: "Indoor",
    origin: "Italie",
    flavors: ["mangue", "tropical", "doux"],
    shortDescription: "Fleur CBD tropicale aux notes de mangue.",
    description:
      "Mango Kush CBD apporte une orientation tropicale, douce et fruitée. Son positionnement premium repose sur le profil aromatique, la sélection et une information produit responsable.",
    highlights: ["Profil tropical", "Notes mangue", "THC < 0,3%"],
  },
  {
    id: "fl-006",
    name: "Critical CBD",
    category: "fleurs",
    subcategory: "Indoor",
    image: "/assets/products/fleurs-cbd.svg",
    price: 8.7,
    cbdRate: "10%",
    culture: "Indoor",
    origin: "Espagne",
    flavors: ["boisé", "épicé", "herbacé"],
    shortDescription: "Fleur CBD boisée avec notes végétales.",
    description:
      "Critical CBD propose un profil plus classique, entre notes boisées, végétales et légèrement épicées. Elle complète la gamme avec une référence lisible, sobre et conforme.",
    highlights: ["Profil boisé", "Indoor", "THC < 0,3%"],
  },
  {
    id: "fl-007",
    name: "Blueberry CBD",
    category: "fleurs",
    subcategory: "Indoor",
    image: "/assets/products/fleurs-cbd.svg",
    price: 9.6,
    cbdRate: "12%",
    culture: "Indoor",
    origin: "France",
    flavors: ["myrtille", "fruité", "doux"],
    shortDescription: "Fleur CBD fruitée aux notes de myrtille.",
    description:
      "Blueberry CBD met en avant une identité fruitée, douce et florale. Elle renforce la dimension sensorielle du catalogue avec une approche premium et responsable.",
    highlights: ["Notes myrtille", "Origine France", "THC < 0,3%"],
  },
  {
    id: "fl-008",
    name: "Orange Bud CBD",
    category: "fleurs",
    subcategory: "Indoor",
    image: "/assets/products/fleurs-cbd.svg",
    price: 8.8,
    cbdRate: "11%",
    culture: "Indoor",
    origin: "Italie",
    flavors: ["orange", "zeste", "frais"],
    shortDescription: "Fleur CBD fraîche aux notes d’orange.",
    description:
      "Orange Bud CBD développe un profil frais, lumineux et zesté. Sa fiche produit met l’accent sur l’expérience aromatique et la conformité du taux de THC.",
    highlights: ["Notes orange", "Profil frais", "THC < 0,3%"],
  },
  {
    id: "fl-009",
    name: "Greenhouse Lemon CBD",
    category: "fleurs",
    subcategory: "Greenhouse",
    image: "/assets/products/fleurs-cbd.svg",
    price: 7.2,
    cbdRate: "9%",
    culture: "Greenhouse",
    origin: "France",
    flavors: ["citron", "frais", "floral"],
    shortDescription: "Fleur CBD greenhouse fraîche et citronnée.",
    description:
      "Greenhouse Lemon CBD propose une alternative équilibrée, avec un profil citronné et floral. Elle permet d’élargir la gamme avec une référence claire, accessible et qualitative.",
    highlights: ["Greenhouse", "Notes citronnées", "THC < 0,3%"],
  },
  {
    id: "fl-010",
    name: "Greenhouse Berry CBD",
    category: "fleurs",
    subcategory: "Greenhouse",
    image: "/assets/products/fleurs-cbd.svg",
    price: 7.4,
    cbdRate: "9%",
    culture: "Greenhouse",
    origin: "Italie",
    flavors: ["baies", "floral", "doux"],
    shortDescription: "Fleur CBD greenhouse aux notes de baies.",
    description:
      "Greenhouse Berry CBD se concentre sur une expression fruitée et florale, adaptée à une sélection premium accessible. La présentation reste sobre, claire et responsable.",
    highlights: ["Notes baies", "Greenhouse", "THC < 0,3%"],
  },
  {
    id: "fl-011",
    name: "Greenhouse Cookies CBD",
    category: "fleurs",
    subcategory: "Greenhouse",
    image: "/assets/products/fleurs-cbd.svg",
    price: 7.9,
    cbdRate: "10%",
    culture: "Greenhouse",
    origin: "Espagne",
    flavors: ["biscuit", "doux", "floral"],
    shortDescription: "Fleur CBD greenhouse douce et gourmande.",
    description:
      "Greenhouse Cookies CBD propose un profil rond et doux, avec des notes évoquant le biscuit et une base florale. Une référence sensorielle sans promesse d’effet.",
    highlights: ["Profil doux", "Greenhouse", "THC < 0,3%"],
  },
  {
    id: "fl-012",
    name: "Outdoor Nature CBD",
    category: "fleurs",
    subcategory: "Outdoor",
    image: "/assets/products/fleurs-cbd.svg",
    price: 4.9,
    cbdRate: "6%",
    culture: "Outdoor",
    origin: "France",
    flavors: ["naturel", "herbacé", "terreux"],
    shortDescription: "Fleur CBD outdoor simple et naturelle.",
    description:
      "Outdoor Nature CBD privilégie une identité végétale, naturelle et accessible. Elle complète la gamme avec une référence sobre, orientée traçabilité et conformité.",
    highlights: ["Outdoor", "Origine France", "THC < 0,3%"],
  },
  {
    id: "fl-013",
    name: "Outdoor Citrus CBD",
    category: "fleurs",
    subcategory: "Outdoor",
    image: "/assets/products/fleurs-cbd.svg",
    price: 5.2,
    cbdRate: "7%",
    culture: "Outdoor",
    origin: "Italie",
    flavors: ["agrumes", "frais", "végétal"],
    shortDescription: "Fleur CBD outdoor aux notes d’agrumes.",
    description:
      "Outdoor Citrus CBD offre une lecture fraîche et végétale, avec une touche d’agrumes. Elle s’inscrit dans une sélection claire, sans incitation à un mode de consommation particulier.",
    highlights: ["Outdoor", "Notes agrumes", "THC < 0,3%"],
  },
  {
    id: "fl-014",
    name: "Small Buds Amnesia CBD",
    category: "fleurs",
    subcategory: "Small buds",
    badge: "Prix doux",
    image: "/assets/products/fleurs-cbd.svg",
    price: 5.9,
    cbdRate: "10%",
    culture: "Indoor",
    origin: "Italie",
    flavors: ["agrumes", "pin", "herbacé"],
    shortDescription: "Small buds CBD au profil Amnesia.",
    description:
      "Small Buds Amnesia CBD reprend un profil aromatique vif dans un format plus accessible. La fiche reste centrée sur la qualité de sélection et les informations essentielles.",
    highlights: ["Small buds", "Prix doux", "THC < 0,3%"],
  },
  {
    id: "fl-015",
    name: "Small Buds Lemon CBD",
    category: "fleurs",
    subcategory: "Small buds",
    image: "/assets/products/fleurs-cbd.svg",
    price: 5.7,
    cbdRate: "9%",
    culture: "Indoor",
    origin: "France",
    flavors: ["citron", "floral", "frais"],
    shortDescription: "Small buds CBD citronnés et floraux.",
    description:
      "Small Buds Lemon CBD propose un format accessible avec une identité citronnée et florale. Une référence utile pour enrichir le catalogue avec une option lisible.",
    highlights: ["Small buds", "Notes citron", "THC < 0,3%"],
  },
  {
    id: "fl-016",
    name: "Power Flower Gorilla CBD",
    category: "fleurs",
    subcategory: "Puissantes",
    badge: "CBD élevé",
    image: "/assets/products/fleurs-cbd.svg",
    price: 12.5,
    cbdRate: "18%",
    culture: "Indoor",
    origin: "Suisse",
    flavors: ["terreux", "pin", "cacao"],
    shortDescription: "Fleur CBD premium au taux de CBD élevé.",
    description:
      "Power Flower Gorilla CBD est une référence premium au taux de CBD élevé, avec un profil aromatique terreux, végétal et légèrement cacaoté. Elle reste présentée dans un cadre informatif et conforme.",
    highlights: ["CBD élevé", "Indoor premium", "THC < 0,3%"],
  },

  // Résines CBD — 10 produits
  {
    id: "rs-001",
    name: "Hash Blond Maroc CBD",
    category: "resines",
    subcategory: "Hash blond",
    badge: "Classique",
    image: "/assets/products/resines-cbd.svg",
    price: 7.9,
    cbdRate: "18%",
    origin: "UE",
    flavors: ["épicé", "terreux"],
    shortDescription: "Résine CBD blonde au profil classique.",
    description:
      "Hash Blond Maroc CBD propose une texture travaillée et une identité aromatique épicée et terreuse. Une référence sobre pour structurer une gamme résines premium.",
    highlights: ["Résine blonde", "Profil épicé", "THC < 0,3%"],
    isBestSeller: true,
  },
  {
    id: "rs-002",
    name: "Hash Blond Lemon CBD",
    category: "resines",
    subcategory: "Hash blond",
    image: "/assets/products/resines-cbd.svg",
    price: 8.4,
    cbdRate: "20%",
    origin: "UE",
    flavors: ["citron", "épicé"],
    shortDescription: "Résine CBD blonde aux notes citronnées.",
    description:
      "Hash Blond Lemon CBD associe une base de résine blonde à un profil citronné. La présentation met l’accent sur l’aromatique, la texture et la conformité.",
    highlights: ["Notes citron", "Résine blonde", "THC < 0,3%"],
  },
  {
    id: "rs-003",
    name: "Hash Blond Premium CBD",
    category: "resines",
    subcategory: "Hash blond",
    badge: "Premium",
    image: "/assets/products/resines-cbd.svg",
    price: 9.5,
    cbdRate: "24%",
    origin: "UE",
    flavors: ["épicé", "résineux"],
    shortDescription: "Résine CBD blonde premium et résineuse.",
    description:
      "Hash Blond Premium CBD enrichit la gamme avec une texture plus travaillée et des notes épicées et résineuses. Une référence positionnée sur la qualité et la traçabilité.",
    highlights: ["Premium", "Texture travaillée", "THC < 0,3%"],
    isFeatured: true,
  },
  {
    id: "rs-004",
    name: "Hash Brun Charas CBD",
    category: "resines",
    subcategory: "Hash brun",
    image: "/assets/products/resines-cbd.svg",
    price: 8.6,
    cbdRate: "21%",
    origin: "UE",
    flavors: ["boisé", "poivré"],
    shortDescription: "Résine CBD brune aux notes boisées.",
    description:
      "Hash Brun Charas CBD propose un profil plus profond, avec des notes boisées et poivrées. La fiche reste informative et sans allégation d’effet.",
    highlights: ["Hash brun", "Notes boisées", "THC < 0,3%"],
  },
  {
    id: "rs-005",
    name: "Hash Brun Royal CBD",
    category: "resines",
    subcategory: "Hash brun",
    image: "/assets/products/resines-cbd.svg",
    price: 9.2,
    cbdRate: "23%",
    origin: "UE",
    flavors: ["boisé", "résineux"],
    shortDescription: "Résine CBD brune premium et résineuse.",
    description:
      "Hash Brun Royal CBD développe une identité dense, boisée et résineuse. Elle complète la gamme avec une référence premium et lisible.",
    highlights: ["Hash brun", "Profil résineux", "THC < 0,3%"],
  },
  {
    id: "rs-006",
    name: "Pollen CBD Classic",
    category: "resines",
    subcategory: "Pollen",
    image: "/assets/products/resines-cbd.svg",
    price: 6.9,
    cbdRate: "16%",
    origin: "UE",
    flavors: ["floral", "sec"],
    shortDescription: "Pollen CBD clair, floral et sec.",
    description:
      "Pollen CBD Classic propose une texture claire et un profil floral sec. Une référence accessible pour diversifier le rayon résines.",
    highlights: ["Pollen CBD", "Profil floral", "THC < 0,3%"],
  },
  {
    id: "rs-007",
    name: "Pollen CBD Golden",
    category: "resines",
    subcategory: "Pollen",
    badge: "Nouveau",
    image: "/assets/products/resines-cbd.svg",
    price: 7.8,
    cbdRate: "18%",
    origin: "UE",
    flavors: ["miel", "végétal"],
    shortDescription: "Pollen CBD doré aux notes végétales.",
    description:
      "Pollen CBD Golden se distingue par une présentation lumineuse et une identité aromatique douce et végétale. Une nouveauté sobre et premium.",
    highlights: ["Pollen doré", "Notes végétales", "THC < 0,3%"],
    isNew: true,
  },
  {
    id: "rs-008",
    name: "Double Filtre CBD Original",
    category: "resines",
    subcategory: "Double filtre",
    badge: "CBD élevé",
    image: "/assets/products/resines-cbd.svg",
    price: 11.5,
    cbdRate: "32%",
    origin: "UE",
    flavors: ["résineux", "terreux"],
    shortDescription: "Résine CBD double filtre au taux élevé.",
    description:
      "Double Filtre CBD Original propose une texture dense et un taux de CBD plus élevé, avec un profil résineux et terreux. La fiche reste centrée sur les caractéristiques produit.",
    highlights: ["Double filtre", "CBD élevé", "THC < 0,3%"],
  },
  {
    id: "rs-009",
    name: "Triple Filtre CBD Royal",
    category: "resines",
    subcategory: "Triple filtre",
    badge: "Premium",
    image: "/assets/products/resines-cbd.svg",
    price: 14.9,
    cbdRate: "42%",
    origin: "UE",
    flavors: ["résineux", "épicé"],
    shortDescription: "Résine CBD triple filtre premium.",
    description:
      "Triple Filtre CBD Royal met en avant une sélection premium, une texture travaillée et un profil résineux. Une fiche claire pour utilisateurs avertis.",
    highlights: ["Triple filtre", "Premium", "THC < 0,3%"],
  },
  {
    id: "rs-010",
    name: "Résine CBG Premium",
    category: "resines",
    subcategory: "Premium",
    badge: "CBG",
    image: "/assets/products/resines-cbd.svg",
    price: 13.5,
    cbdRate: "24%",
    cbgRate: "8%",
    origin: "UE",
    flavors: ["floral", "sec"],
    shortDescription: "Résine CBD enrichie en CBG.",
    description:
      "Résine CBG Premium combine une base CBD avec une information claire sur le CBG. Elle s’inscrit dans une gamme premium, sans promesse médicale.",
    highlights: ["CBG", "Sélection premium", "THC < 0,3%"],
  },

  // Cosmétiques CBD — 8 produits
  {
    id: "cs-001",
    name: "Crème CBD Visage Nature",
    category: "cosmetiques",
    subcategory: "Crème",
    badge: "Premium",
    image: "/assets/products/cosmetiques-cbd.svg",
    price: 24.9,
    format: "50 ml",
    flavors: ["neutre"],
    shortDescription: "Crème CBD visage en usage externe uniquement.",
    description:
      "Crème CBD Visage Nature s’intègre dans une routine externe sobre et premium. Sa fiche met en avant la texture, le format et la présentation sans promesse médicale.",
    highlights: [
      "Usage externe uniquement",
      "Format 50 ml",
      "Sans promesse médicale",
    ],
    isFeatured: true,
  },
  {
    id: "cs-002",
    name: "Crème CBD Mains Karité",
    category: "cosmetiques",
    subcategory: "Crème",
    image: "/assets/products/cosmetiques-cbd.svg",
    price: 14.9,
    format: "75 ml",
    flavors: ["karité"],
    shortDescription: "Crème mains CBD au karité.",
    description:
      "Crème CBD Mains Karité propose une texture confortable et un format pratique. Elle est présentée uniquement comme soin cosmétique externe.",
    highlights: [
      "Usage externe uniquement",
      "Format 75 ml",
      "Texture confortable",
    ],
  },
  {
    id: "cs-003",
    name: "Gel CBD Fraîcheur",
    category: "cosmetiques",
    subcategory: "Gel",
    image: "/assets/products/cosmetiques-cbd.svg",
    price: 19.9,
    format: "100 ml",
    flavors: ["menthe"],
    shortDescription: "Gel CBD externe au profil frais.",
    description:
      "Gel CBD Fraîcheur mise sur une texture légère et une sensation aromatique mentholée. La fiche reste prudente, descriptive et conforme.",
    highlights: ["Usage externe uniquement", "Format 100 ml", "Profil menthe"],
  },
  {
    id: "cs-004",
    name: "Baume CBD Classic",
    category: "cosmetiques",
    subcategory: "Baume",
    image: "/assets/products/cosmetiques-cbd.svg",
    price: 18.9,
    format: "30 ml",
    flavors: ["chanvre"],
    shortDescription: "Baume CBD externe au format compact.",
    description:
      "Baume CBD Classic propose une texture riche et un format compact. Il est présenté comme soin externe, sans allégation de soin médical.",
    highlights: ["Usage externe uniquement", "Format 30 ml", "Texture riche"],
  },
  {
    id: "cs-005",
    name: "Baume CBD Calendula",
    category: "cosmetiques",
    subcategory: "Baume",
    image: "/assets/products/cosmetiques-cbd.svg",
    price: 20.9,
    format: "30 ml",
    flavors: ["calendula"],
    shortDescription: "Baume CBD externe au calendula.",
    description:
      "Baume CBD Calendula complète la gamme cosmétique avec une identité végétale et une présentation premium. Usage externe uniquement.",
    highlights: ["Usage externe uniquement", "Calendula", "Format 30 ml"],
  },
  {
    id: "cs-006",
    name: "Huile Massage CBD Nature",
    category: "cosmetiques",
    subcategory: "Huile massage",
    image: "/assets/products/cosmetiques-cbd.svg",
    price: 29.9,
    format: "100 ml",
    flavors: ["naturel"],
    shortDescription: "Huile de massage CBD en usage externe.",
    description:
      "Huile Massage CBD Nature est pensée pour une routine externe. Sa fiche présente le format, la texture et l’univers sensoriel sans promesse médicale.",
    highlights: [
      "Usage externe uniquement",
      "Format 100 ml",
      "Routine externe",
    ],
  },
  {
    id: "cs-007",
    name: "Soin Visage CBD Jour",
    category: "cosmetiques",
    subcategory: "Soin visage",
    image: "/assets/products/cosmetiques-cbd.svg",
    price: 32.9,
    format: "50 ml",
    flavors: ["floral"],
    shortDescription: "Soin visage CBD externe, profil floral.",
    description:
      "Soin Visage CBD Jour propose un format premium et une identité florale discrète. Il reste présenté comme cosmétique externe.",
    highlights: ["Usage externe uniquement", "Format 50 ml", "Profil floral"],
  },
  {
    id: "cs-008",
    name: "Baume Lèvres CBD",
    category: "cosmetiques",
    subcategory: "Baume lèvres",
    image: "/assets/products/cosmetiques-cbd.svg",
    price: 8.9,
    format: "5 ml",
    flavors: ["neutre"],
    shortDescription: "Baume lèvres CBD au format compact.",
    description:
      "Baume Lèvres CBD est une référence cosmétique compacte, pensée pour compléter une gamme premium avec une fiche simple et conforme.",
    highlights: [
      "Usage externe uniquement",
      "Format compact",
      "Sans promesse médicale",
    ],
  },

  // Huiles CBD — 8 produits
  {
    id: "hu-001",
    name: "Huile CBD 5% Nature",
    category: "huiles",
    subcategory: "5%",
    image: "/assets/products/huiles-cbd.svg",
    price: 19.9,
    cbdRate: "5%",
    format: "10 ml",
    flavors: ["naturel"],
    shortDescription: "Huile CBD 5% en usage externe uniquement.",
    description:
      "Huile CBD 5% Nature est présentée dans une logique d’usage externe uniquement. Sa fiche met en avant le format, la concentration et la traçabilité.",
    highlights: ["Usage externe uniquement", "CBD 5%", "Format 10 ml"],
    isFeatured: true,
  },
  {
    id: "hu-002",
    name: "Huile CBD 5% Menthe",
    category: "huiles",
    subcategory: "5%",
    image: "/assets/products/huiles-cbd.svg",
    price: 21.5,
    cbdRate: "5%",
    format: "10 ml",
    flavors: ["menthe"],
    shortDescription: "Huile CBD 5% au profil menthe.",
    description:
      "Huile CBD 5% Menthe propose un profil aromatique frais tout en restant positionnée en usage externe uniquement.",
    highlights: ["Usage externe uniquement", "CBD 5%", "Profil menthe"],
  },
  {
    id: "hu-003",
    name: "Huile CBD 10% Nature",
    category: "huiles",
    subcategory: "10%",
    badge: "Best-seller",
    image: "/assets/products/huiles-cbd.svg",
    price: 29.9,
    cbdRate: "10%",
    format: "10 ml",
    flavors: ["naturel"],
    shortDescription: "Huile CBD 10% en usage externe uniquement.",
    description:
      "Huile CBD 10% Nature est une référence centrale de la gamme, avec une concentration lisible et une présentation responsable.",
    highlights: ["Usage externe uniquement", "CBD 10%", "Format 10 ml"],
    isBestSeller: true,
  },
  {
    id: "hu-004",
    name: "Huile CBD 10% Citron",
    category: "huiles",
    subcategory: "10%",
    image: "/assets/products/huiles-cbd.svg",
    price: 31.5,
    cbdRate: "10%",
    format: "10 ml",
    flavors: ["citron"],
    shortDescription: "Huile CBD 10% au profil citron.",
    description:
      "Huile CBD 10% Citron associe une concentration claire à une identité aromatique fraîche. Usage externe uniquement.",
    highlights: ["Usage externe uniquement", "CBD 10%", "Profil citron"],
  },
  {
    id: "hu-005",
    name: "Huile CBD 20% Nature",
    category: "huiles",
    subcategory: "20%",
    image: "/assets/products/huiles-cbd.svg",
    price: 49.9,
    cbdRate: "20%",
    format: "10 ml",
    flavors: ["naturel"],
    shortDescription: "Huile CBD 20% en usage externe uniquement.",
    description:
      "Huile CBD 20% Nature enrichit la gamme avec une concentration plus élevée, tout en conservant une fiche prudente et descriptive.",
    highlights: ["Usage externe uniquement", "CBD 20%", "Format 10 ml"],
  },
  {
    id: "hu-006",
    name: "Huile CBD 20% Premium",
    category: "huiles",
    subcategory: "20%",
    badge: "Premium",
    image: "/assets/products/huiles-cbd.svg",
    price: 54.9,
    cbdRate: "20%",
    format: "10 ml",
    flavors: ["chanvre"],
    shortDescription: "Huile CBD 20% premium en usage externe.",
    description:
      "Huile CBD 20% Premium propose une présentation plus haut de gamme, centrée sur le format, la concentration et la traçabilité.",
    highlights: ["Usage externe uniquement", "Premium", "CBD 20%"],
  },
  {
    id: "hu-007",
    name: "Huile CBD 30% Nature",
    category: "huiles",
    subcategory: "30%",
    image: "/assets/products/huiles-cbd.svg",
    price: 69.9,
    cbdRate: "30%",
    format: "10 ml",
    flavors: ["naturel"],
    shortDescription: "Huile CBD 30% en usage externe uniquement.",
    description:
      "Huile CBD 30% Nature s’adresse à une gamme plus concentrée, avec une fiche informative, responsable et sans promesse d’effet.",
    highlights: ["Usage externe uniquement", "CBD 30%", "Format 10 ml"],
  },
  {
    id: "hu-008",
    name: "Huile CBG 10%",
    category: "huiles",
    subcategory: "CBG",
    badge: "CBG",
    image: "/assets/products/huiles-cbd.svg",
    price: 39.9,
    cbgRate: "10%",
    format: "10 ml",
    flavors: ["chanvre"],
    shortDescription: "Huile CBG 10% en usage externe uniquement.",
    description:
      "Huile CBG 10% permet d’élargir la gamme avec une référence orientée cannabinoïde complémentaire, présentée en usage externe uniquement.",
    highlights: ["Usage externe uniquement", "CBG 10%", "Format 10 ml"],
  },

  // E-liquides CBD — 8 produits
  {
    id: "el-001",
    name: "E-liquide CBD Menthe Fraîche",
    category: "eliquides",
    subcategory: "Menthe",
    badge: "Best-seller",
    image: "/assets/products/eliquides-cbd.svg",
    price: 19.9,
    cbdRate: "300 mg",
    format: "10 ml",
    flavors: ["menthe"],
    shortDescription: "E-liquide CBD menthe, sans nicotine ni tabac.",
    description:
      "E-liquide CBD Menthe Fraîche propose un profil aromatique frais et lisible. Il est présenté sans nicotine, sans tabac et réservé aux adultes.",
    highlights: ["Sans nicotine", "Sans tabac", "Format 10 ml"],
    isBestSeller: true,
  },
  {
    id: "el-002",
    name: "E-liquide CBD Menthe Chlorophylle",
    category: "eliquides",
    subcategory: "Menthe",
    image: "/assets/products/eliquides-cbd.svg",
    price: 20.9,
    cbdRate: "500 mg",
    format: "10 ml",
    flavors: ["menthe", "chlorophylle"],
    shortDescription: "E-liquide CBD menthe chlorophylle.",
    description:
      "E-liquide CBD Menthe Chlorophylle associe une fraîcheur végétale à une présentation claire et responsable.",
    highlights: ["Sans nicotine", "Sans tabac", "CBD 500 mg"],
  },
  {
    id: "el-003",
    name: "E-liquide CBD Fruits Rouges",
    category: "eliquides",
    subcategory: "Fruits rouges",
    image: "/assets/products/eliquides-cbd.svg",
    price: 19.9,
    cbdRate: "300 mg",
    format: "10 ml",
    flavors: ["fraise", "framboise"],
    shortDescription: "E-liquide CBD fruits rouges.",
    description:
      "E-liquide CBD Fruits Rouges développe une identité fruitée, avec des notes de fraise et de framboise. Sans nicotine et sans tabac.",
    highlights: ["Sans nicotine", "Sans tabac", "Fruits rouges"],
  },
  {
    id: "el-004",
    name: "E-liquide CBD Cassis Framboise",
    category: "eliquides",
    subcategory: "Fruits rouges",
    image: "/assets/products/eliquides-cbd.svg",
    price: 20.9,
    cbdRate: "500 mg",
    format: "10 ml",
    flavors: ["cassis", "framboise"],
    shortDescription: "E-liquide CBD cassis framboise.",
    description:
      "E-liquide CBD Cassis Framboise propose un profil fruité plus intense, toujours présenté sans nicotine et sans tabac.",
    highlights: ["Sans nicotine", "Sans tabac", "CBD 500 mg"],
  },
  {
    id: "el-005",
    name: "E-liquide CBD Chanvre Nature",
    category: "eliquides",
    subcategory: "Chanvre",
    image: "/assets/products/eliquides-cbd.svg",
    price: 18.9,
    cbdRate: "300 mg",
    format: "10 ml",
    flavors: ["chanvre"],
    shortDescription: "E-liquide CBD au profil chanvre.",
    description:
      "E-liquide CBD Chanvre Nature privilégie une identité végétale simple et lisible. Sans nicotine, sans tabac et réservé aux adultes.",
    highlights: ["Sans nicotine", "Sans tabac", "Profil chanvre"],
  },
  {
    id: "el-006",
    name: "E-liquide CBD Agrumes",
    category: "eliquides",
    subcategory: "Agrumes",
    image: "/assets/products/eliquides-cbd.svg",
    price: 20.9,
    cbdRate: "500 mg",
    format: "10 ml",
    flavors: ["orange", "citron"],
    shortDescription: "E-liquide CBD aux notes d’agrumes.",
    description:
      "E-liquide CBD Agrumes met en avant une expression fraîche, orange et citron. La fiche reste descriptive et responsable.",
    highlights: ["Sans nicotine", "Sans tabac", "Notes agrumes"],
  },
  {
    id: "el-007",
    name: "E-liquide CBD Mangue Passion",
    category: "eliquides",
    subcategory: "Tropical",
    badge: "Nouveau",
    image: "/assets/products/eliquides-cbd.svg",
    price: 21.9,
    cbdRate: "500 mg",
    format: "10 ml",
    flavors: ["mangue", "passion"],
    shortDescription: "E-liquide CBD tropical mangue passion.",
    description:
      "E-liquide CBD Mangue Passion enrichit la gamme avec un profil tropical, fruité et lumineux. Sans nicotine, sans tabac.",
    highlights: ["Sans nicotine", "Sans tabac", "Profil tropical"],
    isNew: true,
  },
  {
    id: "el-008",
    name: "Booster CBD 500 mg",
    category: "eliquides",
    subcategory: "Booster CBD",
    image: "/assets/products/eliquides-cbd.svg",
    price: 14.9,
    cbdRate: "500 mg",
    format: "10 ml",
    flavors: ["neutre"],
    shortDescription: "Booster CBD neutre, sans nicotine ni tabac.",
    description:
      "Booster CBD 500 mg propose un format neutre et lisible pour compléter la gamme e-liquides. Présentation réservée aux adultes.",
    highlights: ["Sans nicotine", "Sans tabac", "CBD 500 mg"],
  },

  // Accessoires CBD — 8 produits
  {
    id: "ac-001",
    name: "Grinder Aluminium Noir",
    category: "accessoires",
    subcategory: "Grinder",
    image: "/assets/products/accessoires-cbd.svg",
    price: 12.9,
    format: "4 parties",
    shortDescription: "Grinder aluminium noir au design sobre.",
    description:
      "Grinder Aluminium Noir complète la gamme avec un accessoire robuste, sobre et pratique. Son design s’intègre dans une boutique premium.",
    highlights: ["Accessoire pratique", "Design sobre", "Format 4 parties"],
  },
  {
    id: "ac-002",
    name: "Grinder Aluminium Vert",
    category: "accessoires",
    subcategory: "Grinder",
    image: "/assets/products/accessoires-cbd.svg",
    price: 12.9,
    format: "4 parties",
    shortDescription: "Grinder aluminium vert, finition premium.",
    description:
      "Grinder Aluminium Vert reprend un format 4 parties avec une finition visuelle cohérente avec l’univers vert fluo premium.",
    highlights: ["Accessoire pratique", "Finition verte", "Format 4 parties"],
  },
  {
    id: "ac-003",
    name: "Grinder Premium Métal",
    category: "accessoires",
    subcategory: "Grinder",
    badge: "Premium",
    image: "/assets/products/accessoires-cbd.svg",
    price: 19.9,
    format: "4 parties",
    shortDescription: "Grinder métal premium pour rayon accessoires.",
    description:
      "Grinder Premium Métal apporte une finition plus haut de gamme et complète la sélection accessoires avec une référence solide.",
    highlights: ["Premium", "Métal", "Format 4 parties"],
    isFeatured: true,
  },
  {
    id: "ac-004",
    name: "Vaporisateur Portable Basic",
    category: "accessoires",
    subcategory: "Vaporisateur",
    image: "/assets/products/accessoires-cbd.svg",
    price: 79.9,
    format: "1 unité",
    shortDescription: "Vaporisateur portable au format compact.",
    description:
      "Vaporisateur Portable Basic est présenté comme un accessoire technique compact. La fiche reste descriptive et n’encourage aucun usage inadapté.",
    highlights: [
      "Format compact",
      "Accessoire technique",
      "Présentation responsable",
    ],
  },
  {
    id: "ac-005",
    name: "Feuilles Chanvre Slim",
    category: "accessoires",
    subcategory: "Feuilles",
    image: "/assets/products/accessoires-cbd.svg",
    price: 2.2,
    format: "1 carnet",
    shortDescription: "Feuilles chanvre slim au format carnet.",
    description:
      "Feuilles Chanvre Slim complètent la gamme accessoires avec un format simple et clairement présenté.",
    highlights: [
      "Format carnet",
      "Accessoire complémentaire",
      "Prix accessible",
    ],
  },
  {
    id: "ac-006",
    name: "Balance Précision 0,01 g",
    category: "accessoires",
    subcategory: "Balance",
    image: "/assets/products/accessoires-cbd.svg",
    price: 19.9,
    format: "1 unité",
    shortDescription: "Balance de précision compacte.",
    description:
      "Balance Précision 0,01 g apporte un outil de mesure compact et pratique pour une boutique orientée clarté et précision.",
    highlights: ["Précision 0,01 g", "Format compact", "Accessoire pratique"],
  },
  {
    id: "ac-007",
    name: "Bocal Conservation Verre",
    category: "accessoires",
    subcategory: "Conservation",
    image: "/assets/products/accessoires-cbd.svg",
    price: 9.9,
    format: "250 ml",
    shortDescription: "Bocal en verre pour conservation.",
    description:
      "Bocal Conservation Verre propose une solution sobre pour la conservation. Son format 250 ml est facile à présenter en boutique.",
    highlights: ["Conservation", "Verre", "Format 250 ml"],
  },
  {
    id: "ac-008",
    name: "Plateau Métal Premium",
    category: "accessoires",
    subcategory: "Plateau",
    image: "/assets/products/accessoires-cbd.svg",
    price: 11.9,
    format: "1 unité",
    shortDescription: "Plateau métal premium pour accessoires.",
    description:
      "Plateau Métal Premium complète la sélection avec un accessoire visuel et pratique, cohérent avec un univers boutique premium.",
    highlights: ["Métal", "Premium", "Accessoire complémentaire"],
  },
  // Cosmétiques CBD — +2 produits
  {
    id: "co-009",
    name: "Masque Nuit CBD Velours",
    category: "cosmetiques",
    subcategory: "Masque",
    image: "/assets/products/cosmetiques-cbd.svg",
    price: 24.9,
    format: "50 ml",
    shortDescription: "Masque de nuit cosmétique au fini velours.",
    description:
      "Masque Nuit CBD Velours complète la routine cosmétique avec une texture enveloppante, une présentation premium et une communication strictement orientée soin externe.",
    highlights: ["Soin de nuit", "Texture velours", "Usage externe"],
    isNew: true,
  },
  {
    id: "co-010",
    name: "Roll-on Fraîcheur CBD",
    category: "cosmetiques",
    subcategory: "Roll-on",
    image: "/assets/products/cosmetiques-cbd.svg",
    price: 18.9,
    format: "15 ml",
    shortDescription: "Roll-on cosmétique nomade à effet fraîcheur.",
    description:
      "Roll-on Fraîcheur CBD enrichit la gamme avec un format pratique, discret et facile à comprendre en boutique, toujours présenté en usage externe uniquement.",
    highlights: ["Format nomade", "Effet fraîcheur", "Usage externe"],
  },
  // Huiles CBD — +2 produits
  {
    id: "hu-009",
    name: "Huile Sèche CBD Éclat",
    category: "huiles",
    subcategory: "15%",
    image: "/assets/products/huiles-cbd.svg",
    price: 29.9,
    cbdRate: "15%",
    format: "30 ml",
    shortDescription: "Huile sèche cosmétique au fini léger.",
    description:
      "Huile Sèche CBD Éclat apporte un format intermédiaire à la gamme avec une texture légère, un positionnement premium et une présentation prudente dédiée à l’usage externe.",
    highlights: ["15% CBD", "Texture légère", "Usage externe"],
  },
  {
    id: "hu-010",
    name: "Huile Corps Lavande CBD",
    category: "huiles",
    subcategory: "15%",
    image: "/assets/products/huiles-cbd.svg",
    price: 31.9,
    cbdRate: "15%",
    format: "50 ml",
    flavors: ["lavande", "floral", "doux"],
    shortDescription: "Huile corps cosmétique aux notes de lavande.",
    description:
      "Huile Corps Lavande CBD complète l’offre avec un profil aromatique floral, un flacon valorisant et une fiche claire centrée sur l’usage externe.",
    highlights: ["15% CBD", "Notes lavande", "Usage externe"],
  },
  // E-liquides CBD — +2 produits
  {
    id: "el-009",
    name: "E-liquide Pomme Verte CBD",
    category: "eliquides",
    subcategory: "Fruité",
    image: "/assets/products/eliquides-cbd.svg",
    price: 18.9,
    cbdRate: "10%",
    format: "10 ml",
    flavors: ["pomme verte", "acidulé", "frais"],
    shortDescription: "E-liquide CBD fruité au profil pomme verte.",
    description:
      "E-liquide Pomme Verte CBD renforce la sélection fruitée avec une identité vive, lisible et strictement sans nicotine ni tabac.",
    highlights: ["Sans nicotine", "Profil fruité", "Format 10 ml"],
  },
  {
    id: "el-010",
    name: "E-liquide Vanille Noisette CBD",
    category: "eliquides",
    subcategory: "Gourmand",
    image: "/assets/products/eliquides-cbd.svg",
    price: 19.9,
    cbdRate: "10%",
    format: "10 ml",
    flavors: ["vanille", "noisette", "gourmand"],
    shortDescription: "E-liquide CBD gourmand et rond en bouche.",
    description:
      "E-liquide Vanille Noisette CBD apporte une option plus gourmande au catalogue avec un profil doux, clair et responsable.",
    highlights: ["Sans nicotine", "Profil gourmand", "Format 10 ml"],
  },
  // Accessoires — +2 produits
  {
    id: "ac-009",
    name: "Pochette Anti-odeur Premium",
    category: "accessoires",
    subcategory: "Conservation",
    image: "/assets/products/accessoires-cbd.svg",
    price: 14.9,
    format: "1 unité",
    shortDescription: "Pochette discrète pour transport et rangement.",
    description:
      "Pochette Anti-odeur Premium complète la gamme conservation avec un accessoire pratique, discret et cohérent avec l’univers boutique.",
    highlights: ["Conservation", "Transport discret", "Format compact"],
  },
  {
    id: "ac-010",
    name: "Kit Nettoyage Vaporisateur",
    category: "accessoires",
    subcategory: "Entretien",
    image: "/assets/products/accessoires-cbd.svg",
    price: 8.9,
    format: "1 kit",
    shortDescription: "Kit d’entretien simple pour vaporisateur.",
    description:
      "Kit Nettoyage Vaporisateur apporte une référence utile au catalogue accessoires avec un positionnement pratique et facile à présenter.",
    highlights: ["Entretien", "Kit complet", "Accessoire pratique"],
  },
  // Concentrés CBD — 10 produits
  {
    id: "cc-001",
    name: "Crumble Citrus CBD",
    category: "concentres",
    subcategory: "Crumble",
    image: "/assets/products/concentres-cbd.svg",
    price: 21.9,
    cbdRate: "68%",
    format: "1 g",
    flavors: ["agrumes", "zeste", "résineux"],
    shortDescription: "Concentré CBD crumble aux notes d’agrumes.",
    description:
      "Crumble Citrus CBD ouvre la gamme concentrés avec une texture friable, un profil vif et une fiche responsable pensée pour utilisateurs avertis.",
    highlights: ["Texture crumble", "Profil agrumes", "THC < 0,3%"],
  },
  {
    id: "cc-002",
    name: "Wax Gold CBD",
    category: "concentres",
    subcategory: "Wax",
    image: "/assets/products/concentres-cbd.svg",
    price: 23.9,
    cbdRate: "72%",
    format: "1 g",
    shortDescription: "Wax CBD dorée à la texture souple.",
    description:
      "Wax Gold CBD propose une présentation premium à la texture souple et à l’identité visuelle chaleureuse, sans promesse excessive.",
    highlights: ["Texture souple", "Finition dorée", "THC < 0,3%"],
  },
  {
    id: "cc-003",
    name: "Shatter Amber CBD",
    category: "concentres",
    subcategory: "Shatter",
    image: "/assets/products/concentres-cbd.svg",
    price: 24.9,
    cbdRate: "78%",
    format: "1 g",
    shortDescription: "Shatter CBD ambré à l’aspect translucide.",
    description:
      "Shatter Amber CBD enrichit le catalogue avec une référence plus cristalline, présentée avec sobriété et information claire.",
    highlights: ["Aspect ambré", "Profil premium", "THC < 0,3%"],
  },
  {
    id: "cc-004",
    name: "Isolat CBD 99%",
    category: "concentres",
    subcategory: "Isolat",
    image: "/assets/products/concentres-cbd.svg",
    price: 19.9,
    cbdRate: "99%",
    format: "1 g",
    shortDescription: "Isolat CBD cristallin à haute pureté.",
    description:
      "Isolat CBD 99% apporte une option lisible et technique à la gamme concentrés, avec une présentation dédiée aux profils avertis.",
    highlights: ["99% CBD", "Cristallin", "THC < 0,3%"],
  },
  {
    id: "cc-005",
    name: "Rosin Cold Press CBD",
    category: "concentres",
    subcategory: "Rosin",
    image: "/assets/products/concentres-cbd.svg",
    price: 27.9,
    cbdRate: "64%",
    format: "1 g",
    shortDescription: "Rosin CBD premium à extraction mécanique.",
    description:
      "Rosin Cold Press CBD complète l’offre avec un positionnement premium, une lecture simple de l’extraction et un profil résineux assumé.",
    highlights: ["Extraction mécanique", "Rosin", "THC < 0,3%"],
  },
  {
    id: "cc-006",
    name: "Live Resin Terpènes CBD",
    category: "concentres",
    subcategory: "Live resin",
    image: "/assets/products/concentres-cbd.svg",
    price: 28.9,
    cbdRate: "66%",
    format: "1 g",
    flavors: ["fruité", "résineux", "complexe"],
    shortDescription: "Concentré CBD au profil aromatique expressif.",
    description:
      "Live Resin Terpènes CBD vise les amateurs de profils aromatiques marqués avec une présentation premium et conforme.",
    highlights: ["Profil aromatique", "Live resin", "THC < 0,3%"],
  },
  {
    id: "cc-007",
    name: "Ice Wax CBD",
    category: "concentres",
    subcategory: "Wax",
    image: "/assets/products/concentres-cbd.svg",
    price: 22.9,
    cbdRate: "70%",
    format: "1 g",
    shortDescription: "Wax CBD claire aux reflets glacés.",
    description:
      "Ice Wax CBD ajoute une référence visuelle plus lumineuse à la gamme, tout en restant sobre sur la communication produit.",
    highlights: ["Reflets clairs", "Texture wax", "THC < 0,3%"],
  },
  {
    id: "cc-008",
    name: "Cristaux CBG & CBD",
    category: "concentres",
    subcategory: "Cristaux",
    image: "/assets/products/concentres-cbd.svg",
    price: 26.9,
    cbdRate: "55%",
    cbgRate: "35%",
    format: "1 g",
    shortDescription: "Cristaux concentrés au duo CBD et CBG.",
    description:
      "Cristaux CBG & CBD diversifie la section concentrés avec une présentation plus technique et un rendu premium très lisible.",
    highlights: ["CBD + CBG", "Cristaux", "THC < 0,3%"],
  },
  {
    id: "cc-009",
    name: "Hash Rosin Premium CBD",
    category: "concentres",
    subcategory: "Rosin",
    image: "/assets/products/concentres-cbd.svg",
    price: 29.9,
    cbdRate: "71%",
    format: "1 g",
    shortDescription: "Hash rosin CBD haut de gamme.",
    description:
      "Hash Rosin Premium CBD installe une référence haut de gamme avec un positionnement premium, clair et sans surpromesse.",
    highlights: ["Premium", "Hash rosin", "THC < 0,3%"],
    isFeatured: true,
  },
  {
    id: "cc-010",
    name: "Sauce Terpénique CBD",
    category: "concentres",
    subcategory: "Sauce",
    image: "/assets/products/concentres-cbd.svg",
    price: 25.9,
    cbdRate: "62%",
    format: "1 g",
    shortDescription: "Concentré CBD fluide au profil terpénique.",
    description:
      "Sauce Terpénique CBD clôt la section avec une texture plus fluide, une identité aromatique nette et une fiche dédiée aux utilisateurs avertis.",
    highlights: ["Profil terpénique", "Texture fluide", "THC < 0,3%"],
  },
  // Packs CBD — 10 produits
  {
    id: "pk-001",
    name: "Pack Découverte Fleurs CBD",
    category: "packs",
    subcategory: "Découverte",
    badge: "Starter",
    image: "/assets/products/packs-cbd.svg",
    price: 29.9,
    format: "3 références",
    shortDescription: "Pack découverte autour de trois fleurs CBD.",
    description:
      "Pack Découverte Fleurs CBD propose une porte d’entrée simple dans le catalogue avec une sélection claire, premium et pensée pour la découverte.",
    highlights: ["3 références", "Découverte", "Sélection premium"],
  },
  {
    id: "pk-002",
    name: "Pack Indoor Premium CBD",
    category: "packs",
    subcategory: "Premium",
    badge: "Premium",
    image: "/assets/products/packs-cbd.svg",
    price: 42.9,
    format: "4 références",
    shortDescription: "Pack premium centré sur des sélections indoor.",
    description:
      "Pack Indoor Premium CBD rassemble plusieurs références premium dans une présentation lisible et cohérente avec l’univers boutique.",
    highlights: ["Indoor", "4 références", "Premium"],
  },
  {
    id: "pk-003",
    name: "Pack Résines Signature CBD",
    category: "packs",
    subcategory: "Premium",
    image: "/assets/products/packs-cbd.svg",
    price: 39.9,
    format: "4 références",
    shortDescription: "Sélection de résines CBD aux profils variés.",
    description:
      "Pack Résines Signature CBD permet d’explorer plusieurs textures et signatures visuelles dans un format pratique et premium.",
    highlights: ["Résines variées", "4 références", "Sélection signature"],
  },
  {
    id: "pk-004",
    name: "Pack Huiles Externes CBD",
    category: "packs",
    subcategory: "Découverte",
    image: "/assets/products/packs-cbd.svg",
    price: 44.9,
    format: "3 références",
    shortDescription: "Trio d’huiles cosmétiques à usage externe.",
    description:
      "Pack Huiles Externes CBD structure la gamme huiles avec une offre groupée claire, prudente et premium.",
    highlights: ["Usage externe", "3 références", "Routine corps"],
  },
  {
    id: "pk-005",
    name: "Pack Cosmétiques Routine CBD",
    category: "packs",
    subcategory: "Découverte",
    image: "/assets/products/packs-cbd.svg",
    price: 46.9,
    format: "4 références",
    shortDescription: "Routine cosmétique complète au CBD.",
    description:
      "Pack Cosmétiques Routine CBD réunit plusieurs soins externes pour une présentation cohérente, lisible et orientée rituel premium.",
    highlights: ["Routine complète", "4 références", "Usage externe"],
  },
  {
    id: "pk-006",
    name: "Pack E-liquides Fresh CBD",
    category: "packs",
    subcategory: "Fresh",
    image: "/assets/products/packs-cbd.svg",
    price: 34.9,
    format: "3 références",
    shortDescription: "Sélection d’e-liquides frais et fruités.",
    description:
      "Pack E-liquides Fresh CBD rassemble plusieurs profils aromatiques frais dans un format simple à valoriser en boutique.",
    highlights: ["Sans nicotine", "3 références", "Profils frais"],
  },
  {
    id: "pk-007",
    name: "Pack Accessoires Essentials",
    category: "packs",
    subcategory: "Essentials",
    image: "/assets/products/packs-cbd.svg",
    price: 27.9,
    format: "4 accessoires",
    shortDescription: "Pack d’accessoires essentiels du quotidien.",
    description:
      "Pack Accessoires Essentials condense les accessoires les plus utiles dans une offre groupée claire et facile à présenter.",
    highlights: ["4 accessoires", "Essentiels", "Prix malin"],
  },
  {
    id: "pk-008",
    name: "Pack Mix Best-sellers CBD",
    category: "packs",
    subcategory: "Best-sellers",
    badge: "Best-seller",
    image: "/assets/products/packs-cbd.svg",
    price: 49.9,
    format: "5 références",
    shortDescription: "Sélection mixte des références les plus demandées.",
    description:
      "Pack Mix Best-sellers CBD met en avant les incontournables du catalogue dans un coffret plus généreux et premium.",
    highlights: ["5 références", "Best-sellers", "Sélection mixte"],
    isBestSeller: true,
  },
  {
    id: "pk-009",
    name: "Pack Cadeau Premium CBD",
    category: "packs",
    subcategory: "VIP",
    image: "/assets/products/packs-cbd.svg",
    price: 59.9,
    format: "Coffret 5 références",
    shortDescription: "Coffret cadeau premium prêt à offrir.",
    description:
      "Pack Cadeau Premium CBD apporte une option plus statutaire au catalogue avec une présentation soignée et premium.",
    highlights: ["Coffret cadeau", "Présentation premium", "5 références"],
  },
  {
    id: "pk-010",
    name: "Pack Budget Découverte CBD",
    category: "packs",
    subcategory: "Budget",
    image: "/assets/products/packs-cbd.svg",
    price: 24.9,
    format: "3 références",
    shortDescription: "Pack découverte accessible pour premier achat.",
    description:
      "Pack Budget Découverte CBD complète l’offre avec un format plus accessible, simple à comprendre et cohérent avec une entrée de gamme maîtrisée.",
    highlights: ["Prix accessible", "3 références", "Découverte"],
  },
  // Animaux — 10 produits
  {
    id: "an-001",
    name: "Baume Pattes Chien CBD",
    category: "animaux",
    subcategory: "Chien",
    image: "/assets/products/animaux-cbd.svg",
    price: 17.9,
    cbdRate: "5%",
    format: "50 ml",
    shortDescription: "Baume externe pour soin des pattes.",
    description:
      "Baume Pattes Chien CBD introduit la section animaux avec une présentation prudente, centrée sur le soin externe et sans promesse médicale.",
    highlights: ["Usage externe", "Format baume", "Chien"],
  },
  {
    id: "an-002",
    name: "Spray Pelage Chien CBD",
    category: "animaux",
    subcategory: "Chien",
    image: "/assets/products/animaux-cbd.svg",
    price: 19.9,
    cbdRate: "3%",
    format: "100 ml",
    shortDescription: "Spray cosmétique pour entretien du pelage.",
    description:
      "Spray Pelage Chien CBD complète l’offre avec un format vaporisateur clair, pratique et réservé à l’usage externe.",
    highlights: ["Usage externe", "Spray", "Chien"],
  },
  {
    id: "an-003",
    name: "Shampoing Doux Chien CBD",
    category: "animaux",
    subcategory: "Chien",
    image: "/assets/products/animaux-cbd.svg",
    price: 16.9,
    cbdRate: "2%",
    format: "200 ml",
    shortDescription: "Shampoing doux cosmétique pour chien.",
    description:
      "Shampoing Doux Chien CBD renforce la gamme avec un format hygiène facile à comprendre et toujours présenté avec prudence.",
    highlights: ["Usage externe", "Shampoing", "Chien"],
  },
  {
    id: "an-004",
    name: "Lotion Coussinets Chat CBD",
    category: "animaux",
    subcategory: "Chat",
    image: "/assets/products/animaux-cbd.svg",
    price: 15.9,
    cbdRate: "3%",
    format: "75 ml",
    shortDescription: "Lotion cosmétique externe pour coussinets.",
    description:
      "Lotion Coussinets Chat CBD apporte une référence dédiée au chat avec une formulation externe et une fiche sobre.",
    highlights: ["Usage externe", "Chat", "Format lotion"],
  },
  {
    id: "an-005",
    name: "Baume Truffe & Pattes CBD",
    category: "animaux",
    subcategory: "Baume pattes",
    image: "/assets/products/animaux-cbd.svg",
    price: 18.9,
    cbdRate: "4%",
    format: "50 ml",
    shortDescription: "Baume externe polyvalent pour zones sèches.",
    description:
      "Baume Truffe & Pattes CBD complète la gamme animaux avec un format simple, premium et exclusivement externe.",
    highlights: ["Baume", "Usage externe", "Zones sèches"],
  },
  {
    id: "an-006",
    name: "Huile Soin Poil Long CBD",
    category: "animaux",
    subcategory: "Chat",
    image: "/assets/products/animaux-cbd.svg",
    price: 21.9,
    cbdRate: "5%",
    format: "50 ml",
    shortDescription: "Huile cosmétique externe pour entretien du poil.",
    description:
      "Huile Soin Poil Long CBD diversifie la catégorie avec un flacon premium et une communication claire sur l’usage externe.",
    highlights: ["Usage externe", "Huile soin", "Pelage"],
  },
  {
    id: "an-007",
    name: "Gel Massage Externe Senior CBD",
    category: "animaux",
    subcategory: "Senior",
    image: "/assets/products/animaux-cbd.svg",
    price: 22.9,
    cbdRate: "6%",
    format: "100 ml",
    shortDescription: "Gel cosmétique externe pour routine senior.",
    description:
      "Gel Massage Externe Senior CBD ajoute une référence senior au positionnement prudent, sans allégation et strictement cosmétique.",
    highlights: ["Senior", "Gel externe", "Usage externe"],
  },
  {
    id: "an-008",
    name: "Spray Hygiène Pelage CBD",
    category: "animaux",
    subcategory: "Senior",
    image: "/assets/products/animaux-cbd.svg",
    price: 18.9,
    cbdRate: "3%",
    format: "100 ml",
    shortDescription: "Spray externe pour routine d’hygiène du pelage.",
    description:
      "Spray Hygiène Pelage CBD propose une référence facile à intégrer au catalogue animaux avec un usage externe clairement affiché.",
    highlights: ["Spray", "Hygiène", "Usage externe"],
  },
  {
    id: "an-009",
    name: "Mousse Lavante Pattes CBD",
    category: "animaux",
    subcategory: "Baume pattes",
    image: "/assets/products/animaux-cbd.svg",
    price: 14.9,
    cbdRate: "2%",
    format: "150 ml",
    shortDescription: "Mousse lavante externe pour nettoyage rapide.",
    description:
      "Mousse Lavante Pattes CBD enrichit la gamme avec une référence hygiène pratique, lisible et conforme à une communication prudente.",
    highlights: ["Mousse lavante", "Usage externe", "Pattes"],
  },
  {
    id: "an-010",
    name: "Baume Soin Pelage Premium CBD",
    category: "animaux",
    subcategory: "Chien",
    image: "/assets/products/animaux-cbd.svg",
    price: 23.9,
    cbdRate: "5%",
    format: "60 ml",
    shortDescription: "Baume cosmétique premium pour entretien externe.",
    description:
      "Baume Soin Pelage Premium CBD clôt la section animaux avec un format premium et une fiche produit centrée sur le soin externe.",
    highlights: ["Premium", "Baume", "Usage externe"],
  },
];

export const products: Product[] = seeds.map(createProduct);

export const categoryPreviewImages = products.reduce(
  (acc, product) => {
    if (acc[product.category].includes("/fallback.svg")) {
      acc[product.category] = product.image;
    }

    return acc;
  },
  {
    fleurs: "/products/fleurs/fallback.svg",
    resines: "/products/resines/fallback.svg",
    concentres: "/products/concentres/fallback.svg",
    huiles: "/products/huiles/fallback.svg",
    cosmetiques: "/products/cosmetiques/fallback.svg",
    eliquides: "/products/eliquides/fallback.svg",
    accessoires: "/products/accessoires/fallback.svg",
    packs: "/products/packs/fallback.svg",
    animaux: "/products/animaux/fallback.svg",
  } satisfies Record<ProductCategory, string>,
);

export const featuredProducts = products.filter(
  (product) => product.isFeatured,
);

export const newProducts = products.filter((product) => product.isNew);

export const bestSellerProducts = products.filter(
  (product) => product.isBestSeller,
);

export const getProductBySlug = (slug: string) =>
  products.find((product) => product.slug === slug);

export const getProductsByCategory = (category: ProductCategory) =>
  products.filter((product) => product.category === category);

export const getProductsBySubcategory = (subcategory: string) =>
  products.filter((product) => product.subcategory === subcategory);

export const getProductsBySearch = (query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return products;
  }

  return products.filter((product) =>
    [
      product.name,
      product.category,
      product.subcategory,
      product.shortDescription,
      product.description,
      product.origin,
      product.format,
      ...(product.flavors ?? []),
      ...(product.highlights ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
};

export const productsCountByCategory = products.reduce(
  (acc, product) => {
    acc[product.category] += 1;
    return acc;
  },
  {
    fleurs: 0,
    resines: 0,
    concentres: 0,
    huiles: 0,
    cosmetiques: 0,
    eliquides: 0,
    accessoires: 0,
    packs: 0,
    animaux: 0,
  } satisfies Record<ProductCategory, number>,
);
