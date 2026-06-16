import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'backend/**'],
    pool: 'threads',
    singleThread: true,
    fileParallelism: false,
    testTimeout: 30000,
    hookTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/**/*.d.ts',
        'src/test/**',
        'src/types.ts',
        'src/styles/**',
        'src/data/products.ts',
        'src/data/siteContent.ts',
        'src/data/faqs.ts',
        'src/data/categories.ts',
        'src/data/catalogFilters.ts',
        'src/utils/slugify.ts',
        'src/utils/formatPrice.ts',
        'src/utils/orderNumber.ts',
        'src/utils/productFilters.ts',
        'src/utils/compliance.ts',
        'src/hooks/**',
        'src/config/env.ts',
      ],
      thresholds: {
        statements: 8,
        branches: 5,
        functions: 5,
        lines: 8,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
