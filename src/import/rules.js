/**
 * Import ordering ESLint rules.
 *
 * Rules included:
 * - `import/order`: Enforce sorted imports with newlines between groups
 * - `import/no-deprecated`: Warn on using deprecated imports
 *
 * @type {import('eslint').Linter.RulesRecord}
 */
const importRules = {
  'import/order': [
    'warn',
    {
      'newlines-between': 'always',
      named: true,
      alphabetize: { order: 'asc' },
    },
  ],
  'import/no-deprecated': 'warn',
};

export default importRules;
