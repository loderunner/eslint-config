import { applyOxlintOnly } from './apply-oxlint-only.js';

/**
 * Rules present only on the oxc side of `base` — the `eslint:recommended`
 * members (surfaced today through `@eslint/js`'s recommended config, not
 * through `packages/eslint-config-loderunner/src/base/rules.js`) that oxlint
 * files under `pedantic` or `restriction` rather than `correctness`, so they
 * do not turn on for free under `categories.correctness: "error"` and must
 * be restated explicitly (plan Part 4, "`categories.correctness` is the only
 * category enabled...").
 *
 * @type {Record<string, { severity: string | [string, ...unknown[]], justification: string }>}
 */
export const oxlintOnly = {
  'eslint/no-array-constructor': {
    severity: 'error',
    justification:
      'member of eslint:recommended (via @eslint/js); oxlint files it under pedantic, which is off by default, so it must be restated to keep parity with eslint:recommended.',
  },
  'eslint/no-case-declarations': {
    severity: 'error',
    justification:
      'member of eslint:recommended; pedantic in oxlint (off by default), must be restated.',
  },
  'eslint/no-fallthrough': {
    severity: 'error',
    justification:
      'member of eslint:recommended; pedantic in oxlint (off by default), must be restated.',
  },
  'eslint/no-prototype-builtins': {
    severity: 'error',
    justification:
      'member of eslint:recommended; pedantic in oxlint (off by default), must be restated.',
  },
  'eslint/no-empty': {
    severity: 'error',
    justification:
      'member of eslint:recommended; restriction in oxlint (off by default), must be restated.',
  },
  'eslint/no-regex-spaces': {
    severity: 'error',
    justification:
      'member of eslint:recommended; restriction in oxlint (off by default), must be restated.',
  },
};

/**
 * oxlint fragment mirroring `eslint-config-loderunner/base` (plus
 * `eslint-config-loderunner/formatting`, which collapses into `base` on the
 * oxc side — see plan Part 1). Values are literal, hand-derived from
 * `packages/eslint-config-loderunner/src/{base,formatting}/rules.js` through
 * `shared/rule-map.js`, not live-imported at run time: `oxc-config-loderunner`
 * ships no runtime dependencies, so it cannot import `eslint-config-loderunner`
 * without reintroducing the ESLint peer chain an oxc-only consumer has
 * deliberately dropped. Re-derive by hand if either source file changes;
 * `shared/test/rule-map.test.js` and `pnpm run generate:oxc && git diff
 * --exit-code` both catch a fragment that has drifted out of sync.
 *
 * Declares no `plugins` — the default plugin set (`eslint`, `typescript`,
 * `unicorn`, `oxc`) already covers everything this fragment uses.
 *
 * @type {import('oxlint').OxlintConfig}
 */
export const base = {
  rules: {
    // packages/eslint-config-loderunner/src/base/rules.js, via rule-map.js
    'eslint/eqeqeq': 'error',
    'eslint/no-var': 'error',
    'eslint/no-duplicate-imports': 'error',
    'eslint/no-unused-vars': [
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
    'loderunner/no-chained-arrow': 'error',

    // packages/eslint-config-loderunner/src/formatting/rules.js, via rule-map.js
    'eslint/curly': ['error', 'all'],

    // oxc-only additions — see `oxlintOnly` above
    ...applyOxlintOnly(oxlintOnly),
  },
};

export default base;
