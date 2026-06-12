import 'dotenv/config';

function optional(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

export const ENV = {
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: parseInt(optional('PORT', '4000'), 10),
  DATABASE_URL: optional('DATABASE_URL'),
  JWT_SECRET: optional('JWT_SECRET', 'dev-insecure-secret'),
  ADMIN_EMAIL: optional('ADMIN_EMAIL'),
  FRONTEND_ORIGINS: optional('FRONTEND_ORIGINS', 'http://localhost:5173').split(',').map(s => s.trim()),
  SMTP_HOST: optional('SMTP_HOST'),
  SMTP_PORT: parseInt(optional('SMTP_PORT', '587'), 10),
  SMTP_USER: optional('SMTP_USER'),
  SMTP_PASS: optional('SMTP_PASS'),
  SMTP_FROM: optional('SMTP_FROM'),
} as const;
