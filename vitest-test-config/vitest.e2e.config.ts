import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'e2e',
    environment: 'node',
    // include both simple e2e files and the flow tests that use ".flow.e2e.test.ts"
    include: [
      'e2e/**/*.e2e.test.ts',
      'e2e/**/*.flow.e2e.test.ts',
      // also pick up full‑flow tests from the main workspace folder
      '../__tests__/e2e/**/*.ts',
    ],
    setupFiles: ['./vitest.setup.e2e.ts'],
    globalSetup: './e2e/globalSetup.ts',
    globals: true,
    testTimeout: 30000,                          // Full request cycles
    hookTimeout: 30000,
    pool: 'forks',
    poolOptions: {
      forks: { singleFork: true },               // Run E2E sequentially
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '..'),
    },
  },
});
