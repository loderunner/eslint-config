/**
 * Base JavaScript rules for ESLint.
 *
 * Rules included:
 * - `eqeqeq`: Require strict equality operators (`===` and `!==`)
 * - `no-var`: Disallow the use of `var`
 * - `no-duplicate-imports`: Disallow duplicate imports from the same module
 *
 * @type {import('eslint').Linter.Config}
 */
const baseRules = {
  rules: {
    eqeqeq: 'error',
    'no-var': 'error',
    'no-duplicate-imports': 'error',
  },
};

export default baseRules;
