import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: 'rules',
    globals: true,
    include: ['test/rules/**/*.test.js'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'test/acceptance/fixtures/**',
    ],
  },
});
