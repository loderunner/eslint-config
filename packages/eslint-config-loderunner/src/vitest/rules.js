/**
 * Vitest-specific ESLint rules for test files.
 *
 * Rules changed:
 * - `@typescript-eslint/no-explicit-any`: Disabled for test flexibility
 * - `@typescript-eslint/unbound-method`: Disabled for test flexibility
 * - `@typescript-eslint/no-unsafe-assignment`: Disabled for test flexibility
 * - `@typescript-eslint/no-unsafe-member-access`: Disabled for test flexibility
 *
 * @type {import('eslint').Linter.RulesRecord}
 */
const vitestRules = {
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/unbound-method': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
};

export default vitestRules;
