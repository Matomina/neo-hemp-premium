import { describe, it, expect } from 'vitest';

describe('ENV config frontend', () => {
  it('IS_MOCK est un boolean', async () => {
    // In test env VITE_API_URL is not set so IS_MOCK should be true
    // We mock the module to avoid import.meta.env issues
    const { ENV } = await import('../config/env');
    expect(typeof ENV.IS_MOCK).toBe('boolean');
  });

  it('API_URL est une string', async () => {
    const { ENV } = await import('../config/env');
    expect(typeof ENV.API_URL).toBe('string');
  });

  it('IS_MOCK est un boolean (true ou false selon la config)', async () => {
    const { ENV } = await import('../config/env');
    // In test environment, IS_MOCK may be true or false depending on VITE_API_URL
    expect(typeof ENV.IS_MOCK).toBe('boolean');
  });
});
