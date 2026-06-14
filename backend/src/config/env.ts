import 'dotenv/config';
import { z } from 'zod';

// ─── Schema ───────────────────────────────────────────────────────────────────

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  ADMIN_EMAIL: z.string().default(''),
  ADMIN_PASS_HASH: z.string().default(''),
  FRONTEND_ORIGINS: z.string().default('http://localhost:5173'),
  // SMTP
  SMTP_HOST: z.string().default(''),
  SMTP_PORT: z.string().default('587'),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  SMTP_FROM: z.string().default('Culture Bio Diamant <no-reply@culturebiodiamant.fr>'),
  SMTP_SECURE: z.string().default('false'),
  // Stripe
  STRIPE_ENABLED: z.string().default('false'),
  STRIPE_MODE: z.enum(['test', 'live']).default('test'),
  STRIPE_SECRET_KEY: z.string().default(''),
  STRIPE_WEBHOOK_SECRET: z.string().default(''),
  STRIPE_SUCCESS_URL: z.string().default('http://localhost:5173/confirmation'),
  STRIPE_CANCEL_URL: z.string().default('http://localhost:5173/panier'),
  // Storage
  STORAGE_PATH: z.string().default('./storage'),
});

// ─── Parse & validate ─────────────────────────────────────────────────────────

function parseEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('[ENV] Configuration invalide :', parsed.error.flatten().fieldErrors);
    process.exit(1);
  }

  const data = parsed.data;

  // ── Production guards ──────────────────────────────────────────────────────
  if (data.NODE_ENV === 'production') {
    const required = ['DATABASE_URL', 'JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASS_HASH', 'FRONTEND_ORIGINS'] as const;
    for (const key of required) {
      if (!data[key]) {
        console.error(`[ENV] Variable manquante en production : ${key}`);
        process.exit(1);
      }
    }

    if (data.JWT_SECRET === 'dev-insecure-secret' || data.JWT_SECRET === 'dev_super_secret_change_me_123456789') {
      console.error('[ENV] JWT_SECRET ne peut pas être une valeur de développement en production');
      process.exit(1);
    }

    if (data.JWT_SECRET.length < 32) {
      console.error('[ENV] JWT_SECRET doit faire au moins 32 caractères en production');
      process.exit(1);
    }

    if (data.STRIPE_ENABLED === 'true') {
      if (!data.STRIPE_SECRET_KEY || !data.STRIPE_WEBHOOK_SECRET) {
        console.error('[ENV] STRIPE_SECRET_KEY et STRIPE_WEBHOOK_SECRET sont requis si STRIPE_ENABLED=true');
        process.exit(1);
      }
    }
  }

  return data;
}

const data = parseEnv();

// ─── Typed ENV export (backward-compatible shape) ─────────────────────────────

export const ENV = {
  NODE_ENV: data.NODE_ENV,
  PORT: parseInt(data.PORT, 10),
  DATABASE_URL: data.DATABASE_URL,
  JWT_SECRET: data.JWT_SECRET,
  JWT_EXPIRES_IN: data.JWT_EXPIRES_IN,
  ADMIN_EMAIL: data.ADMIN_EMAIL,
  ADMIN_PASS_HASH: data.ADMIN_PASS_HASH,
  FRONTEND_ORIGINS: data.FRONTEND_ORIGINS.split(',').map((s) => s.trim()),
  // SMTP
  SMTP_HOST: data.SMTP_HOST,
  SMTP_PORT: parseInt(data.SMTP_PORT, 10),
  SMTP_USER: data.SMTP_USER,
  SMTP_PASS: data.SMTP_PASS,
  SMTP_FROM: data.SMTP_FROM,
  SMTP_SECURE: data.SMTP_SECURE === 'true',
  // Stripe
  STRIPE_ENABLED: data.STRIPE_ENABLED === 'true',
  STRIPE_MODE: data.STRIPE_MODE,
  STRIPE_SECRET_KEY: data.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: data.STRIPE_WEBHOOK_SECRET,
  STRIPE_SUCCESS_URL: data.STRIPE_SUCCESS_URL,
  STRIPE_CANCEL_URL: data.STRIPE_CANCEL_URL,
  // Storage
  STORAGE_PATH: data.STORAGE_PATH,
} as const;

export const IS_DEV = ENV.NODE_ENV === 'development';
export const IS_PROD = ENV.NODE_ENV === 'production';
