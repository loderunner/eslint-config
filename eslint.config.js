import baseConfig from './src/base/config';
import formattingConfig from './src/formatting/config';
import importConfig from './src/import/config';
import jsdocConfig from './src/jsdoc/config';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['node_modules'] },
  ...baseConfig,
  ...importConfig,
  ...jsdocConfig,
  ...formattingConfig, // Must be last
];
