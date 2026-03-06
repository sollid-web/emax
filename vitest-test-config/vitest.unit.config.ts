import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    name: 'unit',
    environment: 'jsdom',                        // DOM for React components
    include: [
      'src/**/__tests__/unit/**/*.test.{ts,tsx}',
      'src/**/*.unit.test.{ts,tsx}',
    ],
    setupFiles: ['./vitest.setup.unit.ts'],
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    css: true,                                   // Handle CSS imports
  },
});
