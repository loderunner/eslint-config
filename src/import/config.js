import importPlugin from 'eslint-plugin-import';

import importRules from './rules.js';

/**
 * Import ordering ESLint config with plugin, settings, and custom rules.
 * Includes eslint-plugin-import with TypeScript and Node resolver settings.
 *
 * @type {import('eslint').Linter.Config[]}
 */
const importConfig = [
  {
    plugins: { import: importPlugin },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: importRules,
  },
];

export default importConfig;
