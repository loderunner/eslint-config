import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'vitest.rules.config.js',
      'packages/eslint-config-loderunner/vitest.acceptance.config.js',
      'packages/oxc-config-loderunner/vitest.acceptance.config.js',
    ],
  },
});
