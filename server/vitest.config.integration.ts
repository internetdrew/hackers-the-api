import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/tests/**/*.test.ts'],
    // maxConcurrency: 1,
    setupFiles: ['src/tests/helpers/setup.ts'],
    fileParallelism: false,
    // env: {
    //   PORT: '5000',
    //   NODE_ENV: 'test',
    // },
  },
  resolve: {
    alias: {
      auth: '/src/auth',
      quotes: '/src/quotes',
      lib: '/src/lib',
    },
  },
});
