import 'dotenv/config';

function optional(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

function bool(key: string, fallback: boolean): boolean {
  const val = process.env[key];
  if (val === undefined) return fallback;
  return val === 'true' || val === '1';
}

export const ENV = {
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: parseInt(optional('PORT', '4000'), 10),
  DATABASE_URL: optional('DATABASE_URL'),
  JWT_SECRET: optional('JWT_SECRET', 'dev-insecure-secret'),
  JWT_EXPIRES_IN: optional('JWT_EXPIRES_IN', '7d'),
  ADMIN_EMAIL: optional('ADMIN_EMAIL'),
  ADMIN_PASS_HASH: optional('ADMIN_PASS_HASH'),
  FRONTEND_ORIGINS: optional('FRONTEND_ORIGINS', 'http://localhost:5173').split(',').map(s => s.trim()),
  // SMTP
  SMTP_HOST: optional('SMTP_HOST'),
  SMTP_PORT: parseInt(optional('SMTP_PORT', '587'), 10),
  SMTP_USER: optional('SMTP_USER'),
  SMTP_PASS: optional('SMTP_PASS'),
  SMTP_FROM: optional('SMTP_FROM', 'Culture Bio Diamant <no-reply@culturebiodiamant.fr>'),
  SMTP_SECURE: bool('SMTP_SECURE', false),
  // Stripe
  STRIPE_SECRET_KEY: optional('STRIPE_SECRET_KEY'),
  STRIPE_WEBHOOK_SECRET: optional('STRIPE_WEBHOOK_SECRET'),
  STRIPE_SUCCESS_URL: optional('STRIPE_SUCCESS_URL', 'http://localhost:5173/confirmation'),
  STRIPE_CANCEL_URL: optional('STRIPE_CANCEL_URL', 'http://localhost:5173/panier'),
  STRIPE_ENABLED: bool('STRIPE_ENABLED', false),
  STRIPE_MODE: optional('STRIPE_MODE', 'test') as 'test' | 'live',
  // Storage
  STORAGE_PATH: optional('STORAGE_PATH', './storage'),
} as const;

export const IS_DEV = ENV.NODE_ENV === 'development';
export const IS_PROD = ENV.NODE_ENV === 'production';
