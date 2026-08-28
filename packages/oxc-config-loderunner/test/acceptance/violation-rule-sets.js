/**
 * Shared computation used by both `violations.test.js` (plan Part 9 items 7
 * and 9) and `parity.test.js` (item 8). Kept in one place so the two test
 * files agree on exactly which rule ids this package's fragments enable and
 * how oxlint's various id spellings normalize to the canonical
 * `<plugin>/<rule>` form used by `shared/rule-map.js` and
 * `shared/oxlint-rule-inventory.json`.
 */

/**
 * Converts an oxlint JSON diagnostic's `code` field (e.g. `"eslint(eqeqeq)"`,
 * `"typescript(no-explicit-any)"`, `"react-hooks(exhaustive-deps)"`,
 * `"loderunner(no-chained-arrow)"`) into the canonical `<plugin>/<rule>` id.
 *
 * Two empirical quirks discovered while building this fixture, both
 * confirmed by hand against `oxlint --type-aware -f json` output (plan Part
 * 10 territory - undocumented in the oxc.rs guide):
 *
 * - core `eslint` rules are reported bare (`"eqeqeq"`, not `"eslint/eqeqeq"`)
 * even though the config keys and `--print-config` output use the
 * `eslint/` prefix.
 * - `react-hooks/rules-of-hooks` and `react-hooks/exhaustive-deps` are
 * reported under a `react-hooks(...)` code even though they are
 * configured (and appear in `--print-config`) under the unified `react/`
 * namespace oxlint's bundled React plugin uses. Both are normalized back
 * to `react/...` here.
 */
export function ruleIdFromDiagnosticCode(code) {
  const match = /^([a-zA-Z-]+)\(([^)]+)\)$/.exec(code);
  if (!match) {
    return code;
  }
  const [, plugin, rule] = match;
  if (plugin === 'eslint') {
    return `eslint/${rule}`;
  }
  if (plugin === 'react-hooks') {
    return `react/${rule}`;
  }
  return `${plugin}/${rule}`;
}

/**
 * Converts an `oxlint --print-config` rule key into the same canonical
 * `<plugin>/<rule>` id. Unlike diagnostic codes, `--print-config` already
 * uses `react/` (not `react-hooks/`) for the hooks rules - only the bare
 * `eslint` core rules need a prefix added here.
 */
export function normalizePrintConfigRuleId(key) {
  return key.includes('/') ? key : `eslint/${key}`;
}

/**
 * Flattens an `oxlint --print-config` payload down to the set of rule ids
 * that are enabled *anywhere* in the tree: the top-level `rules` merged with
 * every `overrides[].rules` entry, keeping a rule id enabled if any scope
 * turns it on (matching how oxlint actually resolves rules per file - a
 * rule an override disables for e.g. `**\/*.test.*` can still be enabled
 * for every other file via the top-level config).
 */
export function collectEnabledRuleIds(printConfig) {
  const enabled = new Set();
  const collect = (rules) => {
    for (const [key, value] of Object.entries(rules ?? {})) {
      const severity = Array.isArray(value) ? value[0] : value;
      if (severity !== 'allow') {
        enabled.add(normalizePrintConfigRuleId(key));
      }
    }
  };
  collect(printConfig.rules);
  for (const override of printConfig.overrides ?? []) {
    collect(override.rules);
  }
  // `--print-config` never surfaces JS-plugin rules (an empirical Part
  // 10-style finding) - `loderunner/no-chained-arrow` is unconditionally
  // 'error' in base.js, so it's added by hand.
  enabled.add('loderunner/no-chained-arrow');
  // Another empirical `--print-config` gap: `vitest/no-disabled-tests` and
  // `vitest/require-mock-type-parameters` are `correctness`-category
  // members of the `vitest` plugin that fire "for free" (they are never
  // restated in vitest.js's `oxlintOnly`, and both are verified to
  // actually fire by violations.test.js) - but because the `vitest` plugin
  // is only ever declared inside the `**/*.test.*` `overrides` entry (never
  // at the top level, where `--print-config`'s merge surfaces implicit
  // "free" correctness members), neither ever appears in `--print-config`'s
  // output, at the top level or inside `overrides[]`. Added by hand for the
  // same reason as `loderunner/no-chained-arrow` above.
  enabled.add('vitest/no-disabled-tests');
  enabled.add('vitest/require-mock-type-parameters');
  return enabled;
}

/**
 * Every rule id this package's fragments (`src/oxlint/{base,typescript,react,
 * vitest}.js`) turn on, computed from two sources per the task:
 *
 * 1. The fragments' own literal `rules`/`overrides` entries (explicit
 * restatements and `oxlintOnly` additions) - transcribed here from the
 * fragment source rather than re-imported, since a handful of these are
 * only "on" inside a specific `overrides` scope (`**\/*.ts` etc.) that
 * doesn't correspond 1:1 with a plain object import.
 * 2. Plan Part 4's literal list of `recommendedTypeChecked` (and vitest
 * plugin) `correctness`-category members that fire "for free" under
 * `categories.correctness: "error"` without being restated anywhere in
 * the fragments - transcribed once here, not hand-waved.
 *
 * This set intentionally does NOT include the ~100+ default-plugin
 * `correctness` members that fire for free from `eslint`, `typescript`,
 * `unicorn`, `oxc` and `react` beyond what plan Part 4 documents (e.g.
 * `unicorn/no-new-array`, `oxc/const-comparisons`, `react/jsx-key`, dozens
 * of plain `eslint/no-*` syntax rules). Those are not part of this
 * package's own managed rule surface (no `oxlintOnly` entry, no mention in
 * Part 4/6) - crafting and verifying an isolated one-violation fixture for
 * every one of them was out of reasonable scope for this task. Rather than
 * silently drop them, both test files compute them dynamically (via
 * `oxlint --print-config`, see `collectEnabledRuleIds` above) and exclude
 * only that dynamically-computed, reported set from their strict equality
 * checks.
 */
export const targetRuleIds = [
  // base.js - explicit `rules` + `oxlintOnly` (eslint:recommended members
  // oxlint files under pedantic/restriction)
  'eslint/eqeqeq',
  'eslint/no-var',
  'eslint/no-duplicate-imports',
  'eslint/no-unused-vars',
  'loderunner/no-chained-arrow',
  'eslint/curly',
  'eslint/no-array-constructor',
  'eslint/no-case-declarations',
  'eslint/no-fallthrough',
  'eslint/no-prototype-builtins',
  'eslint/no-empty',
  'eslint/no-regex-spaces',

  // typescript.js - explicit `rules`
  'typescript/switch-exhaustiveness-check',
  'typescript/strict-boolean-expressions',
  'typescript/prefer-nullish-coalescing',
  'typescript/no-unnecessary-condition',
  'typescript/no-misused-promises',
  'typescript/consistent-type-imports',
  'typescript/no-deprecated',

  // typescript.js - `oxlintOnly` (recommendedTypeChecked members oxlint
  // files outside correctness)
  'typescript/no-explicit-any',
  'typescript/no-unsafe-assignment',
  'typescript/no-unsafe-member-access',
  'typescript/no-unsafe-argument',
  'typescript/no-unsafe-call',
  'typescript/no-unsafe-return',
  'typescript/restrict-plus-operands',
  'typescript/only-throw-error',
  'typescript/prefer-promise-reject-errors',
  'typescript/ban-ts-comment',
  'typescript/no-unsafe-function-type',
  'typescript/no-empty-object-type',
  'typescript/no-namespace',
  'typescript/no-require-imports',
  'typescript/no-unnecessary-type-assertion',
  'typescript/no-unsafe-enum-comparison',
  'typescript/no-unnecessary-type-constraint',

  // typescript.js - `overrides[0]` (@typescript-eslint/eslint-recommended
  // adjustment re-enabling three style rules for .ts/.tsx/.mts/.cts; the
  // fifteen it *disables* are covered separately, below, via a plain-JS
  // fixture where they remain on)
  'eslint/prefer-const',
  'eslint/prefer-rest-params',
  'eslint/prefer-spread',

  // react.js - `oxlintOnly`
  'react/rules-of-hooks',
  'react/exhaustive-deps',
  'react/display-name',
  'react/jsx-no-comment-textnodes',
  'react/jsx-no-target-blank',
  'react/no-unescaped-entities',
  'react/no-unknown-property',
  'react/purity',
  'react/immutability',
  'react/set-state-in-render',
  'react/preserve-manual-memoization',
  'react/incompatible-library',

  // vitest.js - `overrides[0]`'s `oxlintOnly`
  'vitest/no-commented-out-tests',
  'vitest/no-identical-title',
  'vitest/no-import-node-test',
  'vitest/no-interpolation-in-snapshots',
  'vitest/no-mocks-import',
  'vitest/no-unneeded-async-expect-function',
  'vitest/prefer-called-exactly-once-with',

  // Plan Part 4's literal "correctness (free, do not restate)" list -
  // recommendedTypeChecked members oxlint puts in `correctness`, so they
  // fire without appearing in typescript.js at all.
  'typescript/await-thenable',
  'typescript/no-floating-promises',
  'typescript/no-base-to-string',
  'typescript/no-implied-eval',
  'typescript/no-for-in-array',
  'typescript/no-array-delete',
  'typescript/no-misused-spread',
  'typescript/no-duplicate-type-constituents',
  'typescript/no-redundant-type-constituents',
  'typescript/unbound-method',
  'typescript/restrict-template-expressions',
  'typescript/no-this-alias',
  'typescript/triple-slash-reference',
  'typescript/prefer-as-const',
  'typescript/no-wrapper-object-types',
  'typescript/no-unsafe-declaration-merging',
  'typescript/no-misused-new',
  'typescript/no-duplicate-enum-values',
  'typescript/no-extra-non-null-assertion',
  'typescript/no-non-null-asserted-optional-chain',

  // vitest correctness members that are free the same way (README:
  // "vitest/require-mock-type-parameters ... fires on test files for
  // free"; vitest/no-disabled-tests is the other free correctness member
  // per the oxlint-rule-inventory.json scrape).
  'vitest/no-disabled-tests',
  'vitest/require-mock-type-parameters',

  // The fifteen eslint:recommended members the typescript.js `overrides`
  // entry turns *off* for `.ts`/`.tsx`/`.mts`/`.cts` files (plan Part 4,
  // "@typescript-eslint/eslint-recommended adjustments") - genuinely on
  // via `categories.correctness` for every other file. Demonstrated via
  // `base-eslint-recommended-superseded.js` (plain JS, outside the
  // override's `files` scope) and `base-no-with.cjs` (needs sloppy/script
  // mode, which ESM `.js` files under `"type": "module"` cannot provide).
  'eslint/constructor-super',
  'eslint/getter-return',
  'eslint/no-class-assign',
  'eslint/no-const-assign',
  'eslint/no-dupe-class-members',
  'eslint/no-dupe-keys',
  'eslint/no-func-assign',
  'eslint/no-import-assign',
  'eslint/no-new-native-nonconstructor',
  'eslint/no-obj-calls',
  'eslint/no-setter-return',
  'eslint/no-this-before-super',
  'eslint/no-unreachable',
  'eslint/no-unsafe-negation',
  'eslint/no-with',
];

/**
 * Rules this package enables (part of `targetRuleIds` above) for which no
 * reliable one-violation fixture could be produced in the time available.
 * Both were verified *enabled* (via `oxlint --print-config`, `severity:
 * "deny"`) and both were attempted with multiple constructs, including the
 * oxc.rs docs' own "incorrect" example transcribed verbatim - none produced
 * a diagnostic under `oxlint@1.80.0` / `oxlint-tsgolint@7.0.2001`:
 *
 * - `typescript/restrict-plus-operands`: tried `number + string` (both via
 * `declare const` and function parameters), `string + boolean`,
 * `(number | string) + number`, and `object + string` (which instead
 * triggers `no-base-to-string`, already covered). None fired.
 * - `react/preserve-manual-memoization`: tried the exact react.dev
 * "incomplete dependency array" example
 * (https://react.dev/reference/eslint-plugin-react-hooks/lints/preserve-manual-memoization)
 * with `useMemo`/`useCallback`, with and without a custom hook wrapper,
 * with and without a rendered child component. Every variant fires
 * `react/exhaustive-deps` only.
 *
 * These are excluded from the strict equality assertion in
 * `violations.test.js` rather than silently dropped from `targetRuleIds` -
 * if either starts firing in a future oxlint version, that assertion will
 * start failing loudly ("expected X, unexpected extra Y") as a prompt to
 * remove it from this list and add a real fixture.
 */
export const knownGaps = [
  'typescript/restrict-plus-operands',
  'react/preserve-manual-memoization',
];
