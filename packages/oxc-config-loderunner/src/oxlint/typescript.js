import { applyOxlintOnly } from './apply-oxlint-only.js';

/**
 * `typescript-eslint`'s `recommendedTypeChecked` members that oxlint files
 * outside `correctness` (plan Part 4). The members oxlint puts in
 * `correctness` are already on for free under `categories.correctness:
 * "error"` and are deliberately not restated here. `no-explicit-any`,
 * `no-unsafe-assignment` and `no-unsafe-member-access` fix a gap in the
 * migration-reference `.oxlintrc.json`, which turned them off inside the
 * vitest test-file override but never turned them on at top level, so they
 * never actually fired.
 *
 * @type {Record<string, { severity: string | [string, ...unknown[]], justification: string }>}
 */
export const oxlintOnly = {
  'typescript/no-explicit-any': {
    severity: 'error',
    justification:
      'restriction in oxlint (off by default); part of recommendedTypeChecked. The migration-reference .oxlintrc.json never restated this at top level (see Part 4 "Gap found"), so this fragment fixes it.',
  },
  'typescript/no-unsafe-assignment': {
    severity: 'error',
    justification:
      'pedantic in oxlint (off by default); part of recommendedTypeChecked. Same gap as no-explicit-any, fixed here.',
  },
  'typescript/no-unsafe-member-access': {
    severity: 'error',
    justification:
      'pedantic in oxlint (off by default); part of recommendedTypeChecked. Same gap as no-explicit-any, fixed here.',
  },
  'typescript/no-unsafe-argument': {
    severity: 'error',
    justification:
      'pedantic in oxlint (off by default); part of recommendedTypeChecked, must be restated.',
  },
  'typescript/no-unsafe-call': {
    severity: 'error',
    justification:
      'pedantic in oxlint (off by default); part of recommendedTypeChecked, must be restated.',
  },
  'typescript/no-unsafe-return': {
    severity: 'error',
    justification:
      'pedantic in oxlint (off by default); part of recommendedTypeChecked, must be restated.',
  },
  'typescript/restrict-plus-operands': {
    severity: 'error',
    justification:
      'pedantic in oxlint (off by default); part of recommendedTypeChecked, must be restated.',
  },
  'typescript/only-throw-error': {
    severity: 'error',
    justification:
      'pedantic in oxlint (off by default); part of recommendedTypeChecked, must be restated.',
  },
  'typescript/prefer-promise-reject-errors': {
    severity: 'error',
    justification:
      'pedantic in oxlint (off by default); part of recommendedTypeChecked, must be restated.',
  },
  'typescript/ban-ts-comment': {
    severity: 'error',
    justification:
      'pedantic in oxlint (off by default); part of recommendedTypeChecked, must be restated.',
  },
  'typescript/no-unsafe-function-type': {
    severity: 'error',
    justification:
      'pedantic in oxlint (off by default); part of recommendedTypeChecked, must be restated.',
  },
  'typescript/no-empty-object-type': {
    severity: 'error',
    justification:
      'restriction in oxlint (off by default); part of recommendedTypeChecked, must be restated.',
  },
  'typescript/no-namespace': {
    severity: 'error',
    justification:
      'restriction in oxlint (off by default); part of recommendedTypeChecked, must be restated.',
  },
  'typescript/no-require-imports': {
    severity: 'error',
    justification:
      'restriction in oxlint (off by default); part of recommendedTypeChecked, must be restated.',
  },
  'typescript/no-unnecessary-type-assertion': {
    severity: 'error',
    justification:
      'suspicious in oxlint (off by default); part of recommendedTypeChecked, must be restated.',
  },
  'typescript/no-unsafe-enum-comparison': {
    severity: 'error',
    justification:
      'suspicious in oxlint (off by default); part of recommendedTypeChecked, must be restated.',
  },
  'typescript/no-unnecessary-type-constraint': {
    severity: 'error',
    justification:
      'suspicious in oxlint (off by default); part of recommendedTypeChecked, must be restated.',
  },
};

/**
 * oxlint fragment mirroring `eslint-config-loderunner/typescript`. Values
 * are literal, hand-derived from
 * `packages/eslint-config-loderunner/src/typescript/rules.js` through
 * `shared/rule-map.js` — see `base.js`'s file-level comment for why these
 * are literal rather than live-imported. `no-redeclare` and
 * `@typescript-eslint/require-await` are both mapped to `null` in the rule
 * map (no-ops: `no-redeclare` is pedantic in oxlint and already off,
 * `require-await` likewise) and so are dropped rather than restated as
 * `"off"`. `@typescript-eslint/no-unused-vars` collapses into
 * `eslint/no-unused-vars` from `base.js` and has no separate entry here.
 *
 * The consumer sets `options.typeAware: true` — that field does not survive
 * `extends` and is a root-config-only concern (see the package README).
 *
 * The `overrides` entry restates the `@typescript-eslint/eslint-recommended`
 * adjustments (disabling base rules superseded by TypeScript's own checks,
 * re-enabling three ES2015+ style rules) scoped to TypeScript files, exactly
 * as `typescript-eslint`'s own `eslintRecommended` config does on the ESLint
 * side. These rule ids have no ESLint-side counterpart in this config (they
 * come from `typescript-eslint`'s bundled adjustment, not from
 * `typescript/rules.js`), so they are not tracked via `oxlintOnly` — see
 * plan Part 4, "is not redundant".
 *
 * Declares no `plugins` — `typescript` and `eslint` are both in oxlint's
 * default plugin set.
 *
 * @type {import('oxlint').OxlintConfig}
 */
export const typescript = {
  rules: {
    'typescript/switch-exhaustiveness-check': [
      'warn',
      { considerDefaultExhaustiveForUnions: true },
    ],
    'typescript/strict-boolean-expressions': [
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
    'typescript/prefer-nullish-coalescing': 'error',
    'typescript/no-unnecessary-condition': 'warn',
    'typescript/no-misused-promises': ['error', { checksVoidReturn: false }],
    'typescript/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
    ],
    'typescript/no-deprecated': 'warn',

    // oxc-only additions — see `oxlintOnly` above
    ...applyOxlintOnly(oxlintOnly),
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
      rules: {
        // @typescript-eslint/eslint-recommended adjustments (plan Part 4) —
        // these base rules are superseded by TypeScript's own compiler
        // checks on TS files, and all are correctness in oxlint (so
        // genuinely on) before being turned off here.
        'eslint/constructor-super': 'off',
        'eslint/getter-return': 'off',
        'eslint/no-class-assign': 'off',
        'eslint/no-const-assign': 'off',
        'eslint/no-dupe-class-members': 'off',
        'eslint/no-dupe-keys': 'off',
        'eslint/no-func-assign': 'off',
        'eslint/no-import-assign': 'off',
        'eslint/no-new-native-nonconstructor': 'off',
        'eslint/no-obj-calls': 'off',
        'eslint/no-setter-return': 'off',
        'eslint/no-this-before-super': 'off',
        'eslint/no-unreachable': 'off',
        'eslint/no-unsafe-negation': 'off',
        'eslint/no-with': 'off',
        // ...and these three are style in oxlint (so genuinely off) before
        // being turned on here, matching TypeScript's own ES2015+ syntax.
        'eslint/prefer-const': 'error',
        'eslint/prefer-rest-params': 'error',
        'eslint/prefer-spread': 'error',
      },
    },
  ],
};

export default typescript;
