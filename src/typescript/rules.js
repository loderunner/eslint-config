/**
 * TypeScript-specific ESLint rules.
 *
 * Rules changed:
 * - `no-redeclare`: Disabled in favor of TypeScript-aware version
 * - `@typescript-eslint/no-unused-vars`: Ignore variables prefixed with `_`
 * - `@typescript-eslint/switch-exhaustiveness-check`: Require exhaustive switch statements
 * - `@typescript-eslint/strict-boolean-expressions`: Require explicit boolean conditions
 * - `@typescript-eslint/prefer-nullish-coalescing`: Prefer `??` over `||`
 * - `@typescript-eslint/no-unnecessary-condition`: Warn on always-truthy/falsy conditions
 * - `@typescript-eslint/no-misused-promises`: Catch misused promises (void returns allowed)
 * - `@typescript-eslint/consistent-type-imports`: Enforce `import type` syntax
 * - `@typescript-eslint/require-await`: Disabled
 *
 * @type {import('eslint').Linter.Config}
 */
const typescriptRules = {
  rules: {
    // Disable base rule in favor of @typescript-eslint/no-redeclare which
    // understands type/value declaration merging.
    'no-redeclare': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/switch-exhaustiveness-check': [
      'warn',
      { considerDefaultExhaustiveForUnions: true },
    ],
    '@typescript-eslint/strict-boolean-expressions': [
      'error',
      {
        allowAny: false,
        allowNullableBoolean: false,
        allowNullableEnum: false,
        allowNullableNumber: false,
        allowNullableObject: false,
        allowNullableString: false,
        allowNumber: false,
        allowString: false,
      },
    ],
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'warn',
    '@typescript-eslint/no-misused-promises': [
      'error',
      { checksVoidReturn: false },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/require-await': 'off',
  },
};

export default typescriptRules;
