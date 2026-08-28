/**
 * Import ordering ESLint rules.
 *
 * Rules included:
 * - `import-x/order`: Enforce sorted imports with newlines between groups
 * - `import-x/no-deprecated`: Warn on using deprecated imports
 *
 * @type {import('eslint').Linter.RulesRecord}
 */
const importRules = {
  'import-x/order': [
    'warn',
    {
      'newlines-between': 'always',
      named: true,
      alphabetize: { order: 'asc' },
    },
  ],
  'import-x/no-deprecated': 'warn',
};

export default importRules;
