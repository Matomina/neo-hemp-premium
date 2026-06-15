import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: [
        'src/server.ts',
        'src/test/**',
        'src/**/*.d.ts',
        'src/types/**',
        'src/utils/orderNumber.ts',
      ],
      thresholds: {
        statements: 25,
        branches: 12,
        functions: 22,
        lines: 28,
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
