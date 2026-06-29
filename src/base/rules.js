/**
 * Base JavaScript rules for ESLint.
 *
 * Rules included:
 * - `eqeqeq`: Require strict equality operators (`===` and `!==`)
 * - `no-var`: Disallow the use of `var`
 * - `no-duplicate-imports`: Disallow duplicate imports from the same module
 * - `loderunner/no-chained-arrow`: Disallow chained arrow function expression bodies
 *
 * @type {import('eslint').Linter.RulesRecord}
 */
const baseRules = {
  eqeqeq: 'error',
  'no-var': 'error',
  'no-duplicate-imports': 'error',
  'loderunner/no-chained-arrow': 'error',
};

export default baseRules;
