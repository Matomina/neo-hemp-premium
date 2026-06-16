# Culture Bio Diamant — Backend API

Express + TypeScript + Prisma + PostgreSQL + Zod.

## Prérequis

- Node.js 20+
- Docker Desktop (pour PostgreSQL local)

## Installation

```bash
# Depuis le dossier backend/
npm install
```

## 1. Configurer l'environnement

```bash
# Windows
copy .env.example .env
notepad .env

# Mac / Linux
cp .env.example .env
```

Ne jamais committer `backend/.env`.

## 2. Lancer PostgreSQL avec Docker

```bash
docker run --name culture-bio-diamant-db \
  -e POSTGRES_USER=cbd \
  -e POSTGRES_PASSWORD=cbd_password \
  -e POSTGRES_DB=culture_bio_diamant \
  -p 5432:5432 \
  -d postgres:16
```

Si le conteneur existe déjà : `docker start culture-bio-diamant-db`

Vérifier : `docker ps`

## 3. Générer le hash admin

```bash
node -e "require('bcryptjs').hash('Admin1234!',12).then(console.log)"
```

Coller le résultat dans `.env` :

```
ADMIN_PASS_HASH=$2b$12$...
```

> Mot de passe uniquement pour le développement local.

## 4. Migrer + seeder

```bash
npm run prisma:migrate
npm run prisma:seed
```

## 5. Lancer l'API

```bash
npm run dev
```

API sur `http://localhost:4000`.

Ajouter aussi dans `backend/.env` :

```env
APP_PUBLIC_URL=http://localhost:5173
```

## URLs de test

| URL | Description |
|---|---|
| `GET /api/health` | État de l'API + STRIPE_ENABLED |
| `POST /api/admin/auth/login` | Login admin |
| `GET /api/admin/dashboard/summary` | Statistiques admin |
| `http://localhost:5173/admin/login` | Interface admin (frontend) |

## Login local (après seed)

```
Email    : admin@culturebiodiamant.fr
Password : Admin1234!
```

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur dev avec rechargement |
| `npm run build` | Compilation TypeScript |
| `npm run check` | Vérification types sans compiler |
| `npm run prisma:generate` | Générer le client Prisma |
| `npm run prisma:migrate` | Appliquer les migrations |
| `npm run prisma:seed` | Seed admin + réglages métier |

## Notes

- **Stripe** : `STRIPE_ENABLED=false` par défaut. Ne pas activer sans validation conformité CBD.
- **Emails** : si `SMTP_HOST` est vide, les emails sont loggués en console (aucun envoi réel).
- **Liens email** : les URLs frontend envoyées par email proviennent de `APP_PUBLIC_URL`.
- **PDF** : stockés dans `backend/storage/invoices/` (git-ignoré).
- **Facturation** : les numéros de facture utilisent désormais une séquence dédiée, sûre en cas de validations concurrentes.
- **Commandes** : les frais de port sont calculés côté backend (`4,90 €` sous `49,00 €`, sinon offerts).
- **Secrets** : ne jamais committer `.env`, `storage/`, ni de clé Stripe ou SMTP.

## Conformité CBD

- Aucune promesse médicale ou thérapeutique
- Paiement Stripe : mode test uniquement, non activé par défaut
- THC ≤ 0,30% conformément à la réglementation française
