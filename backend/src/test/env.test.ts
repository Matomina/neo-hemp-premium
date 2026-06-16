import { describe, it, expect, vi } from 'vitest';
import { mockPrisma } from './mockPrisma';

vi.mock('../config/prisma', () => ({ prisma: mockPrisma }));

describe('Validation ENV', () => {
  it('JWT_SECRET de test a au moins 32 chars', () => {
    expect(process.env['JWT_SECRET']!.length).toBeGreaterThanOrEqual(32);
  });

  it('JWT_SECRET ne vaut pas dev-insecure-secret', () => {
    expect(process.env['JWT_SECRET']).not.toBe('dev-insecure-secret');
  });

  it('JWT_SECRET ne vaut pas dev_super_secret_change_me_123456789', () => {
    expect(process.env['JWT_SECRET']).not.toBe('dev_super_secret_change_me_123456789');
  });

  it('STRIPE_ENABLED est false par défaut dans les tests', () => {
    expect(process.env['STRIPE_ENABLED']).toBe('false');
  });

  it('ADMIN_EMAIL est défini et valide', () => {
    expect(process.env['ADMIN_EMAIL']).toBeTruthy();
    expect(process.env['ADMIN_EMAIL']).toContain('@');
  });

  it('NODE_ENV est test', () => {
    expect(process.env['NODE_ENV']).toBe('test');
  });

  it('DATABASE_URL est défini', () => {
    expect(process.env['DATABASE_URL']).toBeTruthy();
  });

  it('APP_PUBLIC_URL est défini', () => {
    expect(process.env['APP_PUBLIC_URL']).toBeTruthy();
  });
});
