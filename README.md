# Culture Bio Diamant — Boutique CBD Premium

Interface React + Vite pour Culture Bio Diamant. Design premium : noir, vert néon #d6ff31, violet #bb35ff, glassmorphism.

## Stack Frontend

- React 18 + TypeScript + Vite
- React Router DOM
- CSS vanilla (global.css + theme.css) — pas de Tailwind
- Lucide React pour les icônes

## Commandes

```bash
npm install
npm run dev       # dev server
npm run build     # production build
npm run lint      # lint
```

## Architecture

```
src/
  context/       CartContext (localStorage)
  utils/         formatPrice, slugify, productFilters, compliance, orderNumber
  services/      apiClient, productsApi, ordersApi, contactApi...
  config/        env.ts (VITE_API_URL)
  data/          products.ts, categories.ts, siteContent.ts
  components/    Header, Footer, ProductCard, SectionTitle, AgeGate...
  styles/        global.css, theme.css
  App.tsx        Layout global + routing
```

## Variables d'environnement

Copier `.env.example` vers `.env` :

```env
VITE_API_URL=http://localhost:4000
```

En mode développement sans backend, l'app tourne entièrement en mock local.

## Backend

Voir `backend/README.md`. Backend préparé mais non branché en production.

## Conformité CBD

- Aucune promesse médicale
- THC ≤ 0,30% conforme réglementation française
- Réservé aux adultes (age gate)
- **Paiement non activé** — checkout simulé uniquement

## Design

Direction artistique Culture Bio Diamant : ambiance luxe/nature/technologie.
Ne pas modifier les variables CSS `--green`, `--violet`, `--bg` sans validation design.
