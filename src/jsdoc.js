import jsdoc from 'eslint-plugin-jsdoc';

/** @type {import('eslint').Linter.Config} */
export const jsdocConfig = {
  plugins: { jsdoc },
  settings: {
    jsdoc: {
      mode: 'typescript',
    },
  },
  rules: {
    'jsdoc/require-jsdoc': ['warn', { publicOnly: true }],
    'jsdoc/check-alignment': 'warn',
    'jsdoc/check-indentation': 'warn',
    'jsdoc/multiline-blocks': 'warn',
    'jsdoc/no-types': 'warn',
    'jsdoc/require-description': 'warn',
  },
};
