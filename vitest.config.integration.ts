import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/tests/**/*.test.ts'],
    maxConcurrency: 1,
    setupFiles: ['src/tests/setup.ts'],
    fileParallelism: false,
  },
  resolve: {
    alias: {
      auth: '/src/auth',
      quotes: '/src/quotes',
      lib: '/src/lib',
    },
  },
});
