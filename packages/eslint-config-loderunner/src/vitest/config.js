import vitestPlugin from '@vitest/eslint-plugin';

import vitestRules from './rules.js';

/**
 * Vitest ESLint config for test files with recommended rules and custom rules.
 * Includes @vitest/eslint-plugin recommended config.
 *
 * @type {import('eslint').Linter.Config[]}
 */
const vitestConfig = [vitestPlugin.configs.recommended, { rules: vitestRules }];

export default vitestConfig;
