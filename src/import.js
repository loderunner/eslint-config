import importPlugin from 'eslint-plugin-import';

/** @type {import('eslint').Linter.Config} */
export const importOrder = {
  plugins: { import: importPlugin },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
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
