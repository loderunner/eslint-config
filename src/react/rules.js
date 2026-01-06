/**
 * React-specific ESLint rules.
 *
 * Rules included:
 * - `react/jsx-sort-props`: Enforce sorted JSX props (reserved first, callbacks last)
 *
 * @type {import('eslint').Linter.Config}
 */
const reactRules = {
  rules: {
    'react/jsx-sort-props': [
      'warn',
      {
        callbacksLast: true,
        reservedFirst: true,
      },
    ],
  },
};

export default reactRules;
