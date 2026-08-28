import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: 'acceptance-oxc',
    include: ['test/acceptance/**/*.test.js'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    hookTimeout: 60 * 1000,
  },
});
