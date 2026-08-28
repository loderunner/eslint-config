/**
 * Single source of truth mapping every ESLint rule name used by
 * `eslint-config-loderunner`'s presets to its oxlint (or oxfmt) counterpart.
 *
 * `oxlint: null` means the rule has no oxlint equivalent, or is a no-op in
 * ESLint that would also be a no-op in oxlint — either way `reason` records
 * why, so the drift test (shared/test/rule-map.test.js) can tell a documented
 * gap from an unmapped rule.
 *
 * `options` is present only where the two tools' option shapes differ from
 * what the ESLint rule already carries (severity and options otherwise
 * propagate unchanged from the corresponding `src/*\/rules.js` file).
 *
 * @typedef {object} RuleMapEntry
 * @property {string | null} oxlint - oxlint rule id (`<plugin>/<rule>`), or `null` if there is no mapping.
 * @property {string} [reason] - required when `oxlint` is `null`.
 * @property {Record<string, unknown>} [options] - oxlint options, only when they differ in shape from the ESLint rule's own options.
 *
 * @type {Record<string, RuleMapEntry>}
 */
export const ruleMap = {
  // packages/eslint-config-loderunner/src/base/rules.js
  eqeqeq: { oxlint: 'eslint/eqeqeq' },
  'no-var': { oxlint: 'eslint/no-var' },
  'no-duplicate-imports': { oxlint: 'eslint/no-duplicate-imports' },
  'no-unused-vars': { oxlint: 'eslint/no-unused-vars' },
  'loderunner/no-chained-arrow': { oxlint: 'loderunner/no-chained-arrow' },

  // packages/eslint-config-loderunner/src/typescript/rules.js
  'no-redeclare': {
    oxlint: null,
    reason:
      'no-op: base no-redeclare is pedantic in oxlint, so it is already off by default',
  },
  '@typescript-eslint/no-unused-vars': {
    oxlint: null,
    reason:
      'collapses into eslint/no-unused-vars (base) — no oxlint equivalent',
  },
  '@typescript-eslint/switch-exhaustiveness-check': {
    oxlint: 'typescript/switch-exhaustiveness-check',
  },
  '@typescript-eslint/strict-boolean-expressions': {
    oxlint: 'typescript/strict-boolean-expressions',
    reason:
      'oxlint defaults differ from typescript-eslint — all eight allow* options must be pinned false',
  },
  '@typescript-eslint/prefer-nullish-coalescing': {
    oxlint: 'typescript/prefer-nullish-coalescing',
  },
  '@typescript-eslint/no-unnecessary-condition': {
    oxlint: 'typescript/no-unnecessary-condition',
    reason:
      'nursery category — not covered by oxlint semver, may be renamed/removed in a patch',
  },
  '@typescript-eslint/no-misused-promises': {
    oxlint: 'typescript/no-misused-promises',
    options: { checksVoidReturn: false },
  },
  '@typescript-eslint/consistent-type-imports': {
    oxlint: 'typescript/consistent-type-imports',
    options: { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
  },
  '@typescript-eslint/require-await': {
    oxlint: null,
    reason: 'no-op: pedantic, off by default',
  },
  '@typescript-eslint/no-deprecated': { oxlint: 'typescript/no-deprecated' },

  // packages/eslint-config-loderunner/src/react/rules.js
  'react/jsx-sort-props': {
    oxlint: null,
    reason: 'no oxlint equivalent (404)',
  },

  // packages/eslint-config-loderunner/src/vitest/rules.js
  // These four disable typescript-eslint's type-aware rules inside test
  // files; all four map to correctness-category oxlint rules, which are on
  // by default under `categories.correctness: "error"`, so the override is
  // not a no-op.
  '@typescript-eslint/no-explicit-any': {
    oxlint: 'typescript/no-explicit-any',
  },
  '@typescript-eslint/unbound-method': { oxlint: 'typescript/unbound-method' },
  '@typescript-eslint/no-unsafe-assignment': {
    oxlint: 'typescript/no-unsafe-assignment',
  },
  '@typescript-eslint/no-unsafe-member-access': {
    oxlint: 'typescript/no-unsafe-member-access',
  },

  // packages/eslint-config-loderunner/src/formatting/rules.js
  curly: { oxlint: 'eslint/curly', options: ['error', 'all'] },

  // packages/eslint-config-loderunner/src/import/rules.js
  'import-x/order': {
    oxlint: null,
    reason:
      'moved to oxfmt sortImports (statement-level only — named-specifier sorting is dropped, see oxc#20160)',
  },
  'import-x/no-deprecated': {
    oxlint: null,
    reason:
      'no oxlint equivalent (404); partially covered by type-aware typescript/no-deprecated',
  },

  // packages/eslint-config-loderunner/src/jsdoc/rules.js — whole preset dropped
  'jsdoc/require-jsdoc': {
    oxlint: null,
    reason:
      "no oxlint equivalent (404); oxlint's native jsdoc plugin is a different, smaller rule set",
  },
  'jsdoc/check-alignment': {
    oxlint: null,
    reason:
      'no oxlint equivalent (404); layout half may be covered by the oxfmt jsdoc formatting option',
  },
  'jsdoc/check-indentation': {
    oxlint: null,
    reason:
      'no oxlint equivalent (404); layout half may be covered by the oxfmt jsdoc formatting option',
  },
  'jsdoc/multiline-blocks': {
    oxlint: null,
    reason:
      'no oxlint equivalent (404); layout half may be covered by the oxfmt jsdoc formatting option',
  },
  'jsdoc/no-types': { oxlint: null, reason: 'no oxlint equivalent (404)' },
  'jsdoc/require-description': {
    oxlint: null,
    reason: 'no oxlint equivalent (404)',
  },

  // packages/eslint-config-loderunner/src/vue/rules.js — whole preset dropped
  'vue/multi-word-component-names': {
    oxlint: null,
    reason:
      'no oxlint equivalent (404); oxlint does no template linting for Vue at all, so eslint-plugin-vue has no honest port',
  },

  // packages/eslint-config-loderunner/src/tailwindcss/rules.js — whole preset dropped
  'better-tailwindcss/enforce-consistent-variant-order': {
    oxlint: null,
    reason: 'no oxlint counterpart for eslint-plugin-better-tailwindcss',
  },
  'better-tailwindcss/enforce-consistent-variable-syntax': {
    oxlint: null,
    reason: 'no oxlint counterpart for eslint-plugin-better-tailwindcss',
  },
  'better-tailwindcss/enforce-consistent-line-wrapping': {
    oxlint: null,
    reason: 'no oxlint counterpart for eslint-plugin-better-tailwindcss',
  },
};

export default ruleMap;
