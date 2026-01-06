import baseConfig from './src/base/config.js';
import formattingConfig from './src/formatting/config.js';
import importConfig from './src/import/config.js';
import jsdocConfig from './src/jsdoc/config.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['node_modules'] },
  ...baseConfig,
  ...importConfig,
  ...jsdocConfig,
  ...formattingConfig, // Must be last
];
