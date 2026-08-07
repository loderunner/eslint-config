/**
 * Tailwind CSS-specific ESLint rules.
 *
 * Rules changed:
 * - `better-tailwindcss/enforce-consistent-variant-order`: Enabled at `warn`
 * - `better-tailwindcss/enforce-consistent-variable-syntax`: Enabled at `warn`
 *
 * `better-tailwindcss/enforce-consistent-class-order` is already enabled by
 * the plugin's recommended config, so it is not repeated here.
 *
 * @type {import('eslint').Linter.RulesRecord}
 */
const tailwindcssRules = {
  'better-tailwindcss/enforce-consistent-variant-order': 'warn',
  'better-tailwindcss/enforce-consistent-variable-syntax': 'warn',
  'better-tailwindcss/enforce-consistent-line-wrapping': [
    'warn',
    { strictness: 'loose' },
  ],
};

export default tailwindcssRules;
