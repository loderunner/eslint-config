/**
 * Import ordering ESLint rules.
 *
 * Rules included:
 * - `import/order`: Enforce sorted imports with newlines between groups
 *
 * @type {import('eslint').Linter.Config}
 */
const importRules = {
  rules: {
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        named: true,
        alphabetize: { order: 'asc' },
      },
    ],
  },
};

export default importRules;
