import prettierConfig from 'eslint-config-prettier';

import formattingRules from './rules.js';

/**
 * Formatting ESLint config that should be applied LAST in your config array.
 * Includes eslint-config-prettier and re-enables formatting rules that prettier configs disable.
 *
 * @type {import('eslint').Linter.Config[]}
 */
const formattingConfig = [prettierConfig, { rules: formattingRules }];

export default formattingConfig;
