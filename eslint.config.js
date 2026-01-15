import { defineConfig } from 'eslint/config';
import globals from 'globals';

import baseConfig from './src/base/config.js';
import formattingConfig from './src/formatting/config.js';
import importConfig from './src/import/config.js';
import jsdocConfig from './src/jsdoc/config.js';
import vitestConfig from './src/vitest/config.js';

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  { ignores: ['node_modules', 'test/acceptance/fixtures'] },
  ...baseConfig,
  ...importConfig,
  ...jsdocConfig,
  {
    files: ['**/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    extends: [vitestConfig],
  },
  ...formattingConfig, // Must be last
]);
