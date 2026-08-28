import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: 'rules',
    globals: true,
    include: [
      'packages/eslint-plugin-loderunner/test/rules/**/*.test.js',
      'shared/test/**/*.test.js',
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'packages/eslint-config-loderunner/test/acceptance/fixtures/**',
    ],
  },
});
