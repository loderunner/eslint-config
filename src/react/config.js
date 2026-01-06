import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

import reactRules from './rules';

/**
 * React ESLint config with recommended rules and custom rules.
 * Includes eslint-plugin-react and eslint-plugin-react-hooks recommended configs.
 *
 * @type {import('eslint').Linter.Config[]}
 */
const reactConfig = [
  {
    settings: {
      react: { version: 'detect' },
    },
  },
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  reactRules,
];

export default reactConfig;
