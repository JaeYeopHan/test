/// <reference types="vitest" />
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    environment: 'jsdom',
    globals: true,
  },
  plugins: [tsconfigPaths()],
})
