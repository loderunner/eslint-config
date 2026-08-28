import { defineConfig } from 'eslint/config';
import globals from 'globals';

import baseConfig from './packages/eslint-config-loderunner/src/base/config.js';
import formattingConfig from './packages/eslint-config-loderunner/src/formatting/config.js';
import importConfig from './packages/eslint-config-loderunner/src/import/config.js';
import jsdocConfig from './packages/eslint-config-loderunner/src/jsdoc/config.js';
import vitestConfig from './packages/eslint-config-loderunner/src/vitest/config.js';

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  {
    ignores: [
      'node_modules',
      'packages/eslint-config-loderunner/test/acceptance/fixtures',
      'packages/oxc-config-loderunner/test/acceptance/fixtures-violations',
    ],
  },
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
