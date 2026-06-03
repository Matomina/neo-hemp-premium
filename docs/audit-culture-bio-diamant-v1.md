# Audit Culture Bio Diamant V1

Date : 2026-06-03  
Repo : `Matomina/neo-hemp-premium`  
Branche d'audit : `audit/culture-bio-diamant-v1`  
Base analysee : `main` apres merge de la PR #1

## 1. Objectif

Auditer l'etat actuel de la maquette React TypeScript Culture Bio Diamant afin d'identifier les ecarts entre la V1 actuelle et la cible projet : boutique CBD premium, structure scalable, navigation complete, contenus conformes, UX e-commerce et base propre avant integration backend, vrais produits, vrais certificats et paiement compatible CBD.

## 2. Etat valide avant audit

Validation locale fournie sur `main` :

```bash
npm run lint
npm run build
git status
```

Resultat :

- ESLint OK.
- TypeScript + Vite build OK.
- `main` synchronisee avec `origin/main`.
- Working tree clean.
- PR #1 mergee avec ajout de `eslint.config.js`.

## 3. Synthese executive

La V1 est une bonne base de maquette visuelle React TypeScript, mais elle n'est pas encore un site complet Culture Bio Diamant. Le projet compile et possede deja une direction visuelle sombre/verte coherente, une boutique filtree basique, une fiche produit simulee, un panier simple, un checkout fictif, une FAQ et un footer.

Cependant, le repo reste encore tres proche d'une one-page demo : pas de vraies routes, pas de pages dediees, pas d'age gate persistant, pas de favicon, branding encore `Neo Hemp`, boutons non fonctionnels, contenu legal trop incomplet, recherche absente, compte client absent et architecture pas encore conforme a la structure cible.

Priorite recommandee : transformer cette maquette one-page en vraie V1 structurée, sans backend, avec routes front, pages legales placeholders, age gate, branding Culture Bio Diamant, panier plus robuste, recherche front et meilleure separation des donnees.

## 4. Points forts

### 4.1 Base technique saine

- React + TypeScript + Vite.
- Scripts disponibles : `dev`, `build`, `preview`, `lint`.
- TypeScript strict active via `tsconfig.app.json`.
- ESLint flat config ajoute et valide.
- `.gitignore` couvre `node_modules`, `dist`, `.env`, logs et `.vscode`.

### 4.2 Direction UI coherent avec une boutique premium

- Palette sombre, vert neon, accents lumineux.
- Header sticky.
- Hero visuel.
- Cartes produits avec glow, badges et fond sombre.
- Responsive basique avec breakpoints tablette/mobile.

### 4.3 Conformite de discours deja prise en compte

- Exclusion explicite de l'alimentaire CBD, gummies, huiles a ingerer et cannabinoides interdits.
- Plusieurs mentions prudentes : pas d'allegation medicale, certificats, lots, THC conforme.
- Les produits temporaires restent dans fleurs, resines, cosmetiques et accessoires.

## 5. Ecarts critiques a corriger

### P0 — Branding incorrect

Le site affiche encore `Neo Hemp` / `Neo Hemp Premium` dans le header, le hero, le footer, le README et les metadonnees HTML.

Impact : incoherence client majeure. Le projet demande `Culture Bio Diamant`.

Correction attendue :

- Remplacer tout branding visible par `Culture Bio Diamant`.
- Ajouter baseline `Premium Naturel`.
- Remplacer le mark `NH` par un mark `CBD` / diamant.
- Mettre a jour `index.html`, README et textes UI.

### P0 — Pas de pages reelles / pas de routing

L'application est rendue dans `src/App.tsx` comme une one-page avec ancres et `scrollTo`. Les pages attendues ne sont pas de vraies pages front.

Pages cible non implementees en tant que pages dediees :

- Accueil.
- Boutique.
- Fleurs CBD.
- Resines CBD.
- Cosmetiques CBD.
- Accessoires.
- Fiche produit par produit.
- Panier.
- Checkout.
- Confirmation.
- Compte client.
- Connexion / creation de compte.
- A propos.
- Guide CBD legal.
- Certificats & tracabilite.
- FAQ.
- Contact.
- Livraison & retours.
- Mentions legales.
- CGV.
- Confidentialite.
- Cookies.
- Retractation.
- Page ou popup majorite 18+.

Correction attendue : installer ou implementer un routeur front propre, par exemple `react-router-dom`, puis creer `src/pages` et `src/routes`.

### P0 — Age gate 18+ absent

Le cahier des charges impose une verification majorite 18+ persistante via `localStorage`. Aucun composant `AgeGate` n'est present.

Correction attendue :

- Ajouter `src/components/AgeGate.tsx`.
- Stocker l'accord dans `localStorage`.
- Afficher une modale sobre avant l'acces au site.
- Prevoir refus avec message clair.

### P0 — Favicon absent

Aucun `public/favicon.svg` n'est present et `index.html` ne reference pas de favicon.

Correction attendue :

- Ajouter `public/favicon.svg`.
- Mettre a jour `index.html`.
- Creer une icone noire/verte avec diamant/feuille/CBD.

### P1 — Header mobile incomplet

Le bouton menu mobile existe mais ne pilote aucun etat d'ouverture. Les liens sont masques sous 1024px et non remplaces par un menu fonctionnel.

Correction attendue :

- Ajouter `isMenuOpen`.
- Ajouter menu mobile accessible.
- Gerer fermeture au clic et via `Escape` si possible.

### P1 — Recherche non fonctionnelle

Le bouton recherche dans le header n'a aucun comportement. La boutique ne propose pas de champ de recherche.

Correction attendue :

- Ajouter `searchTerm`.
- Filtrer les produits par nom, categorie, badges, description.
- Ajouter champ visible dans boutique ou overlay header.

### P1 — Compte client non fonctionnel

Le bouton compte est purement visuel. Les pages `Compte client` et `Connexion / creation de compte` sont absentes.

Correction attendue :

- Ajouter pages front statiques.
- Formulaires fictifs sans backend.
- Mentions sur simulation et absence d'envoi reel.

### P1 — Panier trop limite

Le panier permet l'ajout, mais pas la suppression ni le changement de quantite. Il n'est pas persistant.

Correction attendue :

- Ajouter increment/decrement/suppression.
- Ajouter persistance `localStorage`.
- Ajouter recap panier plus clair.
- Ajouter confirmation fictive apres checkout.

### P1 — Checkout non valide

Le checkout est un formulaire visuel sans validation minimale ni confirmation.

Correction attendue :

- Champs controles.
- Validation minimale email / nom / adresse / CGV / majorite.
- Page confirmation avec numero de commande fictif.

### P1 — Donnees produits trop pauvres

`Product` est trop limite pour une boutique : pas de slug, images, alt text, stock, popularite, nouveaute, prix compare, details, ingredients/composition, precautions, certificats, score de tri ou champs SEO.

Correction attendue :

- Ajouter `slug`.
- Ajouter `image`, `imageAlt`.
- Ajouter `certificateAvailable`, `labTest`, `trackedLot`.
- Ajouter `details`, `composition`, `precautions`.
- Ajouter `sortScore`, `isNew`, `isBestSeller`.

### P1 — Filtres insuffisants

Les filtres actuels ne couvrent que les categories. Le cahier des charges demande categorie, prix, taux CBD, certificat disponible et tri.

Correction attendue :

- Filtre categorie.
- Filtre prix max.
- Filtre CBD minimum ou plage.
- Filtre certificat disponible.
- Tri popularite, nouveaute, prix croissant, prix decroissant.

### P1 — Textes legaux trop incomplets

Le footer liste les pages legales, mais elles ne sont pas accessibles et le contenu n'existe pas.

Correction attendue :

- Ajouter pages placeholders : mentions legales, CGV, confidentialite, cookies, retractation.
- Ajouter placeholders SIRET, RCS, adresse, hebergeur, responsable publication.
- Ajouter avertissement adulte, responsabilite et absence d'allégation medicale.

## 6. Ecarts moyens a corriger

### P2 — Architecture encore trop plate

Structure actuelle : composants directement dans `src/components`, donnees limitees, une seule page principale.

Structure cible recommandee :

```txt
src/
  assets/
  components/
    layout/
    ui/
    product/
    sections/
  data/
  pages/
  routes/
  styles/
  types/
  utils/
```

Correction attendue : refactor progressif, pas big bang non teste.

### P2 — Accessibilite a renforcer

Points a ameliorer :

- Certains boutons devraient etre des liens ou avoir des labels plus descriptifs.
- Les boutons onglets de fiche produit n'ont pas d'etat actif.
- Le menu mobile n'est pas fonctionnel.
- Les formulaires n'ont pas de labels relies aux champs.
- Les erreurs de formulaire sont absentes.

### P2 — SEO insuffisant

Actuellement `index.html` a un titre et une meta description generiques. Les routes n'existant pas, il n'y a pas de titres/meta par page.

Correction attendue :

- `title` Culture Bio Diamant.
- Meta description conforme.
- Donnees structurees plus tard.
- Pages dediees pour indexation.
- Slugs produits et categories.

### P2 — Images temporaires non centralisees

Une image hero est importee directement dans `App.tsx`. Les cartes produits sont des visuels CSS, pas des images configurables avec alt text.

Correction attendue :

- Centraliser `image`, `imageAlt` dans `products.ts` ou `media.ts`.
- Garder remplacement facile par photos fournisseur.

### P2 — README a mettre a jour

Le README parle encore de `Neo Hemp Premium` et doit documenter la nouvelle roadmap Culture Bio Diamant.

Correction attendue :

- Renommer le projet.
- Ajouter commandes de validation.
- Ajouter roadmap V1.
- Ajouter contraintes conformite.

## 7. Risques projet

### Risque legal / conformite

Le discours est prudent, mais le site doit aller plus loin avant production : textes legaux, avertissement adulte, mentions de documents fournisseur, absence de promesses sante, verification des produits cosmetiques et exclusion stricte des cannabinoides non autorises.

### Risque UX

Une one-page est suffisante pour une maquette, mais pas pour une boutique qui doit rassurer, vendre et structurer l'information. Les utilisateurs doivent trouver facilement produits, categories, certificats, livraison, retour et contact.

### Risque technique

Le `package.json` utilise `latest` pour toutes les dependances. C'est pratique pour init, mais instable pour un projet client. Une future installation peut tirer des versions majeures inattendues.

Correction recommandee : figer les versions apres validation.

### Risque performance

Le hero image pese environ 1,88 MB dans le build. Pour une boutique premium, il faudra optimiser ou remplacer par formats plus legers.

Correction recommandee : WebP/AVIF, tailles responsives, lazy loading hors hero.

## 8. Roadmap de correction recommandee

### Branche 1 — `feature/cbd-branding-agegate-routing`

Objectif : transformer la maquette en vraie base Culture Bio Diamant.

A faire :

- Branding complet Culture Bio Diamant.
- Favicon.
- Age gate localStorage.
- Routing front.
- Header/menu mobile fonctionnel.
- Footer cliquable.
- Pages principales statiques.

Validation :

```bash
npm run lint
npm run build
git status
git diff --stat
```

### Branche 2 — `feature/cbd-shop-product-system`

Objectif : renforcer la boutique.

A faire :

- Slugs produits/categories.
- Donnees produits enrichies.
- Recherche front.
- Filtres prix/CBD/certificat.
- Tri.
- Fiche produit dediee.
- Images/alt text centralises.

Validation :

```bash
npm run lint
npm run build
git status
git diff --stat
```

### Branche 3 — `feature/cbd-cart-checkout-flow`

Objectif : rendre le parcours d'achat simulé credible.

A faire :

- Panier persistant.
- Quantites.
- Suppression.
- Checkout controle.
- Confirmation fictive.
- CTA sticky produit.

Validation :

```bash
npm run lint
npm run build
git status
git diff --stat
```

### Branche 4 — `feature/cbd-legal-content-seo`

Objectif : consolider conformité, SEO et confiance.

A faire :

- Pages legales placeholders detaillees.
- Guide CBD legal complet.
- Certificats & tracabilite complet.
- FAQ longue.
- Livraison & retours.
- Meta titles/descriptions.

Validation :

```bash
npm run lint
npm run build
git status
git diff --stat
```

## 9. Definition of done V1

La V1 sera consideree livrable quand :

- Le branding Culture Bio Diamant est visible partout.
- L'age gate 18+ fonctionne et persiste.
- Les routes principales existent.
- Le menu mobile fonctionne.
- La boutique dispose de recherche, filtres et tri.
- Les fiches produits sont accessibles par slug.
- Le panier supporte ajout, suppression, quantite et persistance.
- Le checkout simule genere une confirmation.
- Les pages legales placeholders existent.
- Aucun discours medical n'est present.
- Les produits alimentaires CBD et cannabinoides exclus ne sont pas presents.
- `npm run lint` passe.
- `npm run build` passe.
- `git status` est clean.

## 10. Prochaine action exacte

Creer la branche :

```bash
git checkout main
git pull origin main
git checkout -b feature/cbd-branding-agegate-routing
```

Puis traiter en premier :

1. Remplacement complet du branding `Neo Hemp` par `Culture Bio Diamant`.
2. Ajout `public/favicon.svg` et lien dans `index.html`.
3. Ajout `AgeGate` persistant.
4. Refactor minimal vers une structure avec `components/layout`, `pages`, `routes`.
5. Ajout routing front et menu mobile fonctionnel.

Validation obligatoire avant PR :

```bash
npm run lint
npm run build
git status
git diff --stat
```
