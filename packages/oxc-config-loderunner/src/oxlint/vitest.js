import { applyOxlintOnly } from './apply-oxlint-only.js';

/**
 * Native oxlint `vitest` plugin rules outside `correctness`, restated to
 * match the plugin's own recommended posture (mirroring what
 * `@vitest/eslint-plugin`'s `recommended` config does on the ESLint side).
 * `vitest/no-disabled-tests` and `vitest/require-mock-type-parameters` are
 * both `correctness` in oxlint and so are already on for free — restating
 * either here would be exactly the no-op the drift test's `"off"` guard
 * exists to catch (they are not disabled here, so the guard is not
 * triggered, but they are also not listed, on purpose).
 *
 * @type {Record<string, { severity: string | [string, ...unknown[]], justification: string }>}
 */
export const oxlintOnly = {
  'vitest/no-commented-out-tests': {
    severity: 'error',
    justification:
      "suspicious in oxlint (off by default); restates the vitest plugin's own recommended severity.",
  },
  'vitest/no-identical-title': {
    severity: 'error',
    justification:
      "style in oxlint (off by default); restates the vitest plugin's own recommended severity.",
  },
  'vitest/no-import-node-test': {
    severity: 'error',
    justification:
      "style in oxlint (off by default); restates the vitest plugin's own recommended severity.",
  },
  'vitest/no-interpolation-in-snapshots': {
    severity: 'error',
    justification:
      "style in oxlint (off by default); restates the vitest plugin's own recommended severity.",
  },
  'vitest/no-mocks-import': {
    severity: 'error',
    justification:
      "style in oxlint (off by default); restates the vitest plugin's own recommended severity.",
  },
  'vitest/no-unneeded-async-expect-function': {
    severity: 'error',
    justification:
      "style in oxlint (off by default); restates the vitest plugin's own recommended severity.",
  },
  'vitest/prefer-called-exactly-once-with': {
    severity: 'error',
    justification:
      "style in oxlint (off by default); restates the vitest plugin's own recommended severity.",
  },
};

/**
 * oxlint fragment mirroring `eslint-config-loderunner/vitest`. Unlike the
 * migration-reference `.oxlintrc.json`, which applied these rules globally,
 * the ESLint preset is scoped to `**\/*.test.*`, so this fragment expresses
 * the whole preset as a single `overrides` entry with its own
 * `plugins: ['vitest']` (plan Part 4, "Correction to the reference config").
 *
 * The four `typescript/*: "off"` entries are hand-derived from
 * `packages/eslint-config-loderunner/src/vitest/rules.js` through
 * `shared/rule-map.js` — see `base.js`'s file-level comment for why they are
 * literal rather than live-imported. All four target rules are
 * `correctness` in oxlint (three via `typescript.js`'s `oxlintOnly`
 * restatement, `typescript/unbound-method` for free), so disabling them here
 * is not a no-op.
 *
 * @type {import('oxlint').OxlintConfig}
 */
export const vitest = {
  overrides: [
    {
      files: ['**/*.test.*'],
      plugins: ['vitest'],
      rules: {
        'typescript/no-explicit-any': 'off',
        'typescript/unbound-method': 'off',
        'typescript/no-unsafe-assignment': 'off',
        'typescript/no-unsafe-member-access': 'off',

        // oxc-only additions — see `oxlintOnly` above
        ...applyOxlintOnly(oxlintOnly),
      },
    },
  ],
};

export default vitest;
