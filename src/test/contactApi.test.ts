import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock env BEFORE importing the service
vi.mock('../config/env', () => ({
  ENV: {
    IS_MOCK: true,
    API_URL: '',
  },
}));

describe('contactApi en mode mock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('résout sans erreur en mode mock avec payload complet', async () => {
    const { contactApi } = await import('../services/contactApi');
    await expect(
      contactApi.send({
        name: 'Test User',
        email: 'test@test.fr',
        subject: 'Sujet test',
        message: 'Message de test complet',
      }),
    ).resolves.not.toThrow();
  });

  it('retourne { mock: true } en mode mock', async () => {
    const { contactApi } = await import('../services/contactApi');
    const result = await contactApi.send({
      name: 'Test',
      email: 'test@test.fr',
      message: 'Message',
    });
    expect(result).toEqual({ mock: true });
  });

  it('résout sans subject (optionnel)', async () => {
    const { contactApi } = await import('../services/contactApi');
    await expect(
      contactApi.send({
        name: 'Test User',
        email: 'test@test.fr',
        message: 'Message sans sujet',
      }),
    ).resolves.toBeDefined();
  });
});
