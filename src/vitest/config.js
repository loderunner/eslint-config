import vitestPlugin from '@vitest/eslint-plugin';

import vitestRules from './rules';

/**
 * Vitest ESLint config for test files with recommended rules and custom rules.
 * Includes @vitest/eslint-plugin recommended config, scoped to test files.
 *
 * @type {import('eslint').Linter.Config[]}
 */
const vitestConfig = [
  {
    files: ['**/*.test.{ts,tsx}'],
    ...vitestPlugin.configs.recommended,
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      ...vitestRules.rules,
    },
  },
];

export default vitestConfig;
