# Guide de déploiement — Culture Bio Diamant

## Prérequis

- Node.js 20+
- PostgreSQL 15+
- Compte Vercel (frontend)
- Compte Render (backend)
- Domaine configuré (optionnel)

## Variables d'environnement

### Frontend (Vercel)

| Variable | Description | Exemple |
|---|---|---|
| `VITE_API_URL` | URL du backend en production | `https://api.culturebiodiamant.fr` |

### Backend (Render)

| Variable | Obligatoire prod | Description |
|---|---|---|
| `NODE_ENV` | ✅ | `production` |
| `PORT` | ✅ | `4000` |
| `DATABASE_URL` | ✅ | URL PostgreSQL complète |
| `JWT_SECRET` | ✅ | Chaîne aléatoire ≥ 32 chars |
| `ADMIN_EMAIL` | ✅ | Email admin |
| `ADMIN_PASS_HASH` | ✅ | Hash bcrypt du mot de passe admin |
| `FRONTEND_ORIGINS` | ✅ | URLs autorisées CORS (séparées par virgule) |
| `STRIPE_ENABLED` | — | `false` par défaut |
| `STRIPE_SECRET_KEY` | Si Stripe activé | Clé secrète Stripe |
| `STRIPE_WEBHOOK_SECRET` | Si Stripe activé | Secret webhook Stripe |
| `SMTP_HOST` | — | Serveur SMTP pour emails |
| `SMTP_PORT` | — | Port SMTP (587 recommandé) |
| `SMTP_USER` | — | Utilisateur SMTP |
| `SMTP_PASS` | — | Mot de passe SMTP |
| `SMTP_FROM` | — | Expéditeur des emails |

## Déploiement Frontend (Vercel)

```bash
# Build local de vérification
npm ci
npm run lint
npm run build

# Vercel CLI
vercel --prod
```

Configurer dans Vercel > Settings > Environment Variables :
- `VITE_API_URL` → URL de votre backend Render

Le fichier `vercel.json` à la racine configure les rewrites SPA pour que toutes les routes (`/boutique`, `/panier`, `/connexion`, etc.) fonctionnent après un refresh navigateur.

## Déploiement Backend (Render)

1. Connecter le repo GitHub sur Render
2. Build command : `cd backend && npm ci && npm run build && npx prisma generate`
3. Start command : `cd backend && node dist/server.js`
4. Ajouter toutes les variables d'environnement ci-dessus

## Base de données PostgreSQL

```bash
# Appliquer les migrations en production
cd backend
npx prisma migrate deploy

# Créer l'admin initial
npm run prisma:seed

# Régénérer le client Prisma
npx prisma generate
```

### Générer le hash admin

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('VOTRE_MOT_DE_PASSE', 12).then(h => console.log(h))"
```

Copier le hash dans `ADMIN_PASS_HASH`.

### Générer un JWT_SECRET sécurisé

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## CORS

`FRONTEND_ORIGINS` doit contenir l'URL exacte du frontend Vercel, ex :
```
FRONTEND_ORIGINS=https://culture-bio-diamant.vercel.app
```

Plusieurs origines séparées par une virgule :
```
FRONTEND_ORIGINS=https://culture-bio-diamant.vercel.app,https://www.culturebiodiamant.fr
```

## Stripe (désactivé par défaut)

- `STRIPE_ENABLED=false` → aucune session Stripe ne sera créée
- Le parcours recommandé : article → panier → demande de commande → validation admin → paiement manuel
- Activer Stripe uniquement après validation par le prestataire de paiement CBD
- `STRIPE_MODE=test` pour les tests — ne jamais mettre `live` sans validation compliance

## Stockage factures PDF

Les factures PDF sont générées côté backend dans `backend/storage/invoices/`.
Sur Render, ce dossier est éphémère. Recommandation : connecter un bucket S3 ou Cloudflare R2.

## Conformité CBD

- Aucune allégation médicale dans les textes produits
- Vérification age-gate (18+) obligatoire côté frontend (implémentée dans `App.tsx`)
- THC ≤ 0,3 % affiché sur tous les produits
- Certificats laboratoire disponibles sur demande
- Le champ `requiresComplianceReview` dans le schéma Prisma permet de bloquer la mise en vente d'un produit non validé

## Checklist post-déploiement

- [ ] `GET /api/health` répond `{ status: "ok" }`
- [ ] Page d'accueil chargée sans erreur console
- [ ] Panier fonctionnel (ajout, suppression, quantité)
- [ ] Formulaire de commande soumis → email admin reçu
- [ ] Formulaire de contact soumis → email reçu
- [ ] Connexion admin `/admin/login` fonctionnelle
- [ ] Dashboard admin affiche les commandes
- [ ] `STRIPE_ENABLED=false` → message d'attente affiché si paiement demandé
- [ ] Refresh navigateur sur `/boutique`, `/panier`, `/connexion` → page correcte (Vercel rewrite)
- [ ] Age-gate affiché au premier accès
- [ ] Pas d'allégation médicale visible dans les pages produit
- [ ] Variables d'environnement backend vérifiées : `JWT_SECRET` ≥ 32 chars, `DATABASE_URL` correcte
- [ ] `npx prisma migrate deploy` exécuté sans erreur
- [ ] Admin user créé via seed (`npm run prisma:seed`)
