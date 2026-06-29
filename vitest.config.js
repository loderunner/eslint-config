import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['vitest.rules.config.js', 'vitest.acceptance.config.js'],
  },
});
