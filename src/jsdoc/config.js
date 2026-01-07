import jsdoc from 'eslint-plugin-jsdoc';

import jsdocRules from './rules.js';

/**
 * JSDoc ESLint config with plugin, settings, and custom rules.
 * Includes eslint-plugin-jsdoc with TypeScript mode settings.
 *
 * @type {import('eslint').Linter.Config[]}
 */
const jsdocConfig = [
  {
    plugins: { jsdoc },
    settings: {
      jsdoc: {
        mode: 'typescript',
      },
    },
    rules: jsdocRules,
  },
];

export default jsdocConfig;
