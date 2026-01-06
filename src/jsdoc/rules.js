/**
 * JSDoc documentation ESLint rules.
 *
 * Rules included:
 * - `jsdoc/require-jsdoc`: Require JSDoc for public functions, methods, and classes
 * - `jsdoc/check-alignment`: Enforce consistent asterisk alignment
 * - `jsdoc/check-indentation`: Enforce consistent tag indentation
 * - `jsdoc/multiline-blocks`: Enforce multiline JSDoc format
 * - `jsdoc/no-types`: Disallow types in JSDoc (prefer TypeScript)
 * - `jsdoc/require-description`: Require a description in JSDoc blocks
 *
 * @type {import('eslint').Linter.Config}
 */
const jsdocRules = {
  rules: {
    'jsdoc/require-jsdoc': [
      'warn',
      {
        publicOnly: true,
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
        },
        checkConstructors: true,
        checkGetters: true,
        checkSetters: false,
      },
    ],
    'jsdoc/check-alignment': 'warn',
    'jsdoc/check-indentation': 'warn',
    'jsdoc/multiline-blocks': 'warn',
    'jsdoc/no-types': 'warn',
    'jsdoc/require-description': 'warn',
  },
};

export default jsdocRules;
