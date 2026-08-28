import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: 'acceptance',
    include: ['test/acceptance/**/*.test.js'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'test/acceptance/fixtures/**',
    ],
    hookTimeout: 60 * 1000,
  },
});
