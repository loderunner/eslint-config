/**
 * React-specific ESLint rules.
 *
 * Rules included:
 * - `react/jsx-sort-props`: Enforce sorted JSX props (reserved first, callbacks last)
 *
 * @type {import('eslint').Linter.RulesRecord}
 */
const reactRules = {
  'react/jsx-sort-props': [
    'warn',
    {
      callbacksLast: true,
      reservedFirst: true,
    },
  ],
};

export default reactRules;
