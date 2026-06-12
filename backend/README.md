# Culture Bio Diamant — Backend API

Stack : Node.js + Express + TypeScript + Prisma + PostgreSQL + Zod

## Installation

```bash
cd backend
npm install
cp .env.example .env
# Editer .env avec vos vraies valeurs
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur dev avec rechargement |
| `npm run build` | Compilation TypeScript |
| `npm run check` | Vérification types sans compiler |
| `npm run prisma:generate` | Générer le client Prisma |
| `npm run prisma:migrate` | Appliquer les migrations |
| `npm run prisma:seed` | Seed initial |

## Variables d'environnement

Voir `.env.example`. Ne jamais committer un `.env` avec de vraies valeurs.

## Conformité CBD

- Aucune promesse médicale ou thérapeutique
- Produits contrôlés par `isSellable`, `launchStatus`, `requiresComplianceReview`
- Paiement Stripe prévu mais NON activé
- THC ≤ 0,30% conformément à la réglementation française

## Sécurité

- Helmet, CORS strict, rate limiting
- JWT pour auth
- Mots de passe hashés avec bcryptjs
- Aucun secret dans Git

## Prochaines étapes

1. Déployer PostgreSQL (Render, Neon, Railway)
2. Configurer .env sur le serveur
3. `prisma migrate deploy`
4. Activer Stripe (ne pas commit les clés)
5. Connecter le front via VITE_API_URL
