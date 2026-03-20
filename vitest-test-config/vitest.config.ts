import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    // Root config runs ALL workspaces
    workspace: [
      './vitest.unit.config.ts',
      './vitest.integration.config.ts',
      './vitest.e2e.config.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/**/index.ts', 'src/**/*.stories.ts'],
      thresholds: {
        branches:   70,
        functions:  80,
        lines:      80,
        statements: 80,
      },
    },
  },
});
