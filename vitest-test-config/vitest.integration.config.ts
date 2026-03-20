import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    name: 'integration',
    environment: 'node',                         // API / DB layer
    include: [
      'src/**/__tests__/integration/**/*.test.ts',
      'src/**/*.integration.test.ts',
    ],
    setupFiles: ['./vitest.setup.integration.ts'],
    globalSetup: './src/__tests__/integration/globalSetup.ts',
    globals: true,
    clearMocks: true,
    testTimeout: 15000,                          // Allow for DB queries
    hookTimeout: 20000,
  },
});
