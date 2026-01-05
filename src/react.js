/** @type {import('eslint').Linter.Config} */
export const react = {
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
