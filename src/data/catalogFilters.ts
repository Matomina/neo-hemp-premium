export type FilterOption = {
  value: string;
  label: string;
  count?: number;
};

export type FilterType = 'select' | 'checkbox' | 'range' | 'toggle';

export type CatalogFilter = {
  id: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
};

export const catalogFilters: CatalogFilter[] = [
  {
    id: 'category',
    label: 'Catégorie',
    type: 'select',
    options: [
      { value: 'all',         label: 'Toutes les catégories' },
      { value: 'fleurs',      label: 'Fleurs CBD',        count: 50 },
      { value: 'resines',     label: 'Résines CBD',       count: 30 },
      { value: 'concentres',  label: 'Concentrés CBD',    count: 12 },
      { value: 'huiles',      label: 'Huiles CBD',        count: 20 },
      { value: 'cosmetiques', label: 'Cosmétiques CBD',   count: 16 },
      { value: 'eliquides',   label: 'E-Liquides CBD',    count: 16 },
      { value: 'accessoires', label: 'Accessoires',       count: 20 },
      { value: 'packs',       label: 'Packs & Box',       count: 8  },
      { value: 'animaux',     label: 'CBD Animaux',       count: 8  },
    ],
  },
  {
    id: 'subcategory',
    label: 'Sous-catégorie',
    type: 'select',
    options: [
      { value: 'all',           label: 'Toutes' },
      // Fleurs
      { value: 'indoor',        label: 'Indoor' },
      { value: 'greenhouse',    label: 'Greenhouse' },
      { value: 'outdoor',       label: 'Outdoor' },
      { value: 'small-buds',    label: 'Small Buds' },
      { value: 'trim',          label: 'Trim' },
      { value: 'rocks',         label: 'Rocks / Moon Rocks' },
      { value: 'pas-cher',      label: 'Prix abordables' },
      { value: 'puissantes',    label: 'Taux élevé' },
      // Résines
      { value: 'hash-blond',    label: 'Hash blond' },
      { value: 'hash-brun',     label: 'Hash brun' },
      { value: 'afghan',        label: 'Afghan' },
      { value: 'pollen',        label: 'Pollen' },
      { value: 'double-filtre', label: 'Double filtré' },
      { value: 'triple-filtre', label: 'Triple filtré' },
      { value: 'premium',       label: 'Premium' },
      { value: 'economique',    label: 'Économique' },
      // Concentrés
      { value: 'crumble',       label: 'Crumble' },
      { value: 'wax',           label: 'Wax' },
      { value: 'shatter',       label: 'Shatter' },
      { value: 'isolat',        label: 'Isolat' },
      { value: 'distillat',     label: 'Distillat' },
      // Huiles
      { value: 'full-spectrum', label: 'Full Spectrum' },
      { value: 'broad-spectrum',label: 'Broad Spectrum' },
      { value: 'cbg',           label: 'CBG' },
      { value: 'cbn',           label: 'CBN' },
      // Animaux
      { value: 'chien',         label: 'Chien' },
      { value: 'chat',          label: 'Chat' },
      { value: 'senior',        label: 'Senior' },
    ],
  },
  {
    id: 'price',
    label: 'Prix',
    type: 'range',
    min: 0,
    max: 200,
    step: 5,
  },
  {
    id: 'cbdRate',
    label: 'Taux CBD',
    type: 'select',
    options: [
      { value: 'all',    label: 'Tous les taux' },
      { value: 'low',    label: 'Moins de 10%' },
      { value: 'medium', label: '10% – 15%' },
      { value: 'high',   label: '15% – 25%' },
      { value: 'very-high', label: 'Plus de 25%' },
    ],
  },
  {
    id: 'culture',
    label: 'Mode de culture',
    type: 'checkbox',
    options: [
      { value: 'Indoor',     label: 'Indoor' },
      { value: 'Greenhouse', label: 'Greenhouse' },
      { value: 'Outdoor',    label: 'Outdoor' },
    ],
  },
  {
    id: 'origin',
    label: 'Origine',
    type: 'select',
    options: [
      { value: 'all',   label: 'Toutes les origines' },
      { value: 'eu',    label: 'Chanvre UE' },
      { value: 'bio',   label: 'Agriculture biologique' },
      { value: 'swiss', label: 'Suisse' },
      { value: 'it',    label: 'Italie' },
    ],
  },
  {
    id: 'isNew',
    label: 'Nouveautés',
    type: 'toggle',
  },
  {
    id: 'isBestSeller',
    label: 'Best-sellers',
    type: 'toggle',
  },
  {
    id: 'hasOldPrice',
    label: 'En promotion',
    type: 'toggle',
  },
];
