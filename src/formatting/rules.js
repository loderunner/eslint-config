/**
 * Formatting rules that should be applied LAST in your config array,
 * after any formatter configs (e.g., eslint-config-prettier).
 *
 * This re-enables formatting rules that prettifier configs typically disable.
 *
 * Rules included:
 * - `curly`: Require braces around all control flow statements
 *
 * @type {import('eslint').Linter.RulesRecord}
 */
const formattingRules = {
  curly: ['error', 'all'],
};

export default formattingRules;
