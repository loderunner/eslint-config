import pluginJs from '@eslint/js';

import baseRules from './rules.js';

/**
 * Base ESLint config with recommended JavaScript rules and custom rules.
 * Includes @eslint/js recommended config.
 *
 * @type {import('eslint').Linter.Config[]}
 */
const baseConfig = [pluginJs.configs.recommended, { rules: baseRules }];

export default baseConfig;
