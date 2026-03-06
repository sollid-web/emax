import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'e2e',
    environment: 'node',
    include: ['e2e/**/*.e2e.test.ts'],
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
});
