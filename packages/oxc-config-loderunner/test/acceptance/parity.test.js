import { execSync } from 'node:child_process';
import { readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { GenericContainer } from 'testcontainers';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { ruleMap } from '../../../../shared/rule-map.js';

import {
  collectEnabledRuleIds,
  ruleIdFromDiagnosticCode,
  targetRuleIds,
} from './violation-rule-sets.js';

const packageRoot = fileURLToPath(new URL('../..', import.meta.url));
const pluginPackageRoot = join(packageRoot, '../eslint-plugin-loderunner');
const eslintConfigPackageRoot = join(
  packageRoot,
  '../eslint-config-loderunner',
);
const fixturesRoot = join(packageRoot, 'test/acceptance/fixtures-violations');

const packagesToPack = [
  { root: packageRoot, prefix: 'oxc-config-loderunner-' },
  { root: pluginPackageRoot, prefix: 'eslint-plugin-loderunner-' },
  { root: eslintConfigPackageRoot, prefix: 'eslint-config-loderunner-' },
];

/**
 * `react/rules-of-hooks` and `react/exhaustive-deps` come from
 * `eslint-plugin-react-hooks` under the `react-hooks/` namespace on the
 * ESLint side, but from oxlint's unified `react/` plugin namespace on the
 * oxlint side (Part 4's own mapping table). This turned out to generalize
 * further than plan Part 6 assumed: `eslint-plugin-react-hooks@7.x` (a real
 * peer here - see the eslint-project fixture's package.json) ships the
 * React Compiler rules too, under the same `react-hooks/` namespace -
 * `react-hooks/purity`, `react-hooks/immutability`,
 * `react-hooks/set-state-in-render`, `react-hooks/incompatible-library`,
 * `react-hooks/set-state-in-effect` all fire on the ESLint side in this
 * fixture tree, contradicting Part 6's assumption that these were oxlint-only
 * additions "added in oxlint v1.79.0" with no ESLint equivalent - a genuine,
 * interesting divergence from the plan discovered by actually running both
 * tools (see the parity report in this task's summary). `react-hooks/X` is
 * therefore mapped to `react/X` unconditionally below, the same transform
 * `shared/rule-map.js` uses nowhere but this task's supplementary map needs
 * for all of `react-hooks/*`, not just the original two.
 *
 * The remaining `react/*` oxlintOnly additions in `react.js`
 * (display-name, jsx-no-comment-textnodes, jsx-no-target-blank,
 * no-unescaped-entities, no-unknown-property) use the same `react/` prefix
 * on both sides already (they come from `eslint-plugin-react`'s own
 * recommended config, which already uses that prefix) - handled by the
 * generic `react/` passthrough below. None of these appear in
 * `shared/rule-map.js` because `eslint-config-loderunner/src/react/rules.js`
 * never mentions them individually - they're inherited in bulk via
 * `reactPlugin.configs.flat.recommended` / `reactHooks.configs.flat.recommended`
 * (see `react/config.js`), the same "bulk-inherited, not individually
 * configured" situation `shared/rule-map.js`'s own doc comment describes
 * for why it's scoped to `rules.js` only.
 *
 * `vitest/require-mock-type-parameters` is the one oxlint-only addition
 * that genuinely has no ESLint-side counterpart at all: the rule exists in
 * `@vitest/eslint-plugin` but is not part of its `recommended` config (see
 * the oxc-config-loderunner README's "Rules oxlint's defaults add" section
 * and `shared/oxlint-rule-inventory.json`'s note on this exact rule).
 */
const oxlintOnlyNoEslintPair = new Set([
  'vitest/require-mock-type-parameters',
  // Genuine divergence, found empirically (not predicted by plan Part 4,
  // which lists this among the "correctness (free, do not restate)"
  // recommendedTypeChecked members that fire on both sides for free):
  // `@typescript-eslint/no-misused-spread` exists as a rule in
  // `typescript-eslint@8.67.0` but is NOT part of its
  // `recommendedTypeChecked` config, so `eslint-config-loderunner` never
  // enables it - while oxlint's `typescript/no-misused-spread` genuinely is
  // `correctness` (on by default). A consumer migrating from
  // `eslint-config-loderunner` to `oxc-config-loderunner` gets this as a
  // brand-new finding class the ESLint config never caught, unlike the
  // other nineteen "free correctness" members in that same Part 4 list,
  // which this test confirms really do fire on both sides.
  'typescript/no-misused-spread',
]);

/**
 * Maps one ESLint finding's rule id to its oxlint equivalent, per plan Part
 * 2/8. `shared/rule-map.js` is the authoritative source, but it is
 * deliberately scoped to "every ESLint rule name appearing in any
 * `packages/eslint-config-loderunner/src/*\/rules.js`" (its own doc
 * comment) - it does not cover rules a preset inherits in bulk from a
 * third-party `recommended` config (`@eslint/js`'s `recommended`,
 * `typescript-eslint`'s `recommendedTypeChecked`, `eslint-plugin-react[-hooks]`'s
 * `recommended`, `@vitest/eslint-plugin`'s `recommended`). Those rules are
 * real parity pairs too (plan Part 4 documents them as firing "for free" on
 * the oxlint side under `categories.correctness`, and the ESLint-side
 * `recommended` configs are exactly why they *also* fire on the ESLint
 * side) - they are just not individually configured, so they're handled
 * here via the same naming-convention transforms `shared/rule-map.js`
 * itself relies on elsewhere, rather than duplicating ~40 near-identical
 * entries.
 *
 * Returns:
 * - a string: the oxlint rule id this ESLint finding is expected to also
 * appear as.
 * - `null`: expected to be ESLint-only (either `shared/rule-map.js` marks
 * `oxlint: null`, or this is one of the rules with no oxlint equivalent).
 * - `undefined`: unhandled - the caller treats this as a hard failure, so an
 * ESLint finding never silently vanishes from the comparison.
 */
function mapEslintRuleToOxlint(eslintRuleId) {
  // Special cases: `typescript-eslint`'s `recommendedTypeChecked` (via its
  // bundled `eslintRecommended` base-rule adjustment) turns off the base
  // rule and turns on a `@typescript-eslint/*`-prefixed replacement for
  // `.ts`/`.tsx` files - for these two, unlike the rest of that adjustment,
  // oxlint has no separate `typescript/*`-prefixed rule at all (base.js
  // keeps `eslint/no-unused-vars`/`eslint/no-array-constructor` on
  // unconditionally, with no type-aware variant - Part 4: "collapses into
  // eslint/no-unused-vars from base"). `no-array-constructor` in
  // particular is a genuine, minor divergence between the two ecosystems'
  // base-rule-adjustment lists: oxlint's own hand-curated "disabled for
  // .ts" list in typescript.js's `overrides` does NOT include
  // `no-array-constructor` (so it stays on via `eslint/no-array-constructor`
  // for every file), while typescript-eslint's `eslintRecommended` DOES
  // swap it out for `@typescript-eslint/no-array-constructor` on `.ts`
  // files specifically - found empirically while building this test, not
  // predicted from the plan.
  if (eslintRuleId === '@typescript-eslint/no-unused-vars') {
    return 'eslint/no-unused-vars';
  }
  if (eslintRuleId === '@typescript-eslint/no-array-constructor') {
    return 'eslint/no-array-constructor';
  }

  if (eslintRuleId in ruleMap) {
    return ruleMap[eslintRuleId].oxlint;
  }
  if (eslintRuleId.startsWith('react-hooks/')) {
    // eslint-plugin-react-hooks's rules (including, as of 7.x, the React
    // Compiler rules) live under oxlint's unified `react/` namespace - see
    // the comment on `oxlintOnlyNoEslintPair` above for why this transform
    // covers more than the original rules-of-hooks/exhaustive-deps pair.
    return `react/${eslintRuleId.slice('react-hooks/'.length)}`;
  }
  if (eslintRuleId.startsWith('@typescript-eslint/')) {
    // typescript-eslint and oxlint's typescript plugin use the same rule
    // names 1:1 - the exact transform shared/rule-map.js's own explicit
    // entries already use (e.g. `@typescript-eslint/no-deprecated` ->
    // `typescript/no-deprecated`).
    return `typescript/${eslintRuleId.slice('@typescript-eslint/'.length)}`;
  }
  if (eslintRuleId.startsWith('vitest/') || eslintRuleId.startsWith('react/')) {
    // @vitest/eslint-plugin / eslint-plugin-react and oxlint's vitest/react
    // plugins use the same rule names for the rules both sides share.
    return eslintRuleId;
  }
  if (!eslintRuleId.includes('/')) {
    // A bare core ESLint rule (no plugin prefix) - `eslint:recommended`
    // members oxlint categorizes outside `correctness`
    // (no-array-constructor etc., base.js's oxlintOnly) and the
    // `@typescript-eslint/eslint-recommended` adjustments
    // (constructor-super, prefer-const etc., typescript.js's overrides)
    // both use this bare-id / `eslint/`-prefixed-id pairing.
    return `eslint/${eslintRuleId}`;
  }
  return undefined;
}

describe('acceptance test: ESLint <-> oxlint parity (plan Part 9 item 8)', () => {
  let oxlintContainer;
  let eslintContainer;
  let tarballPaths;

  beforeAll(
    async () => {
      tarballPaths = packagesToPack.map(({ root, prefix }) => {
        execSync('pnpm pack', { cwd: root });
        const files = readdirSync(root);
        const tarball = files.find(
          (file) => file.startsWith(prefix) && file.endsWith('.tgz'),
        );
        if (!tarball) {
          throw new Error(`Failed to find generated tarball for ${prefix}`);
        }
        return join(root, tarball);
      });

      [oxlintContainer, eslintContainer] = await Promise.all([
        new GenericContainer('node:24-slim')
          .withCommand(['sleep', 'infinity'])
          .withCopyFilesToContainer([
            {
              source: tarballPaths[0],
              target: '/app/fixtures/oxc-config-loderunner.tgz',
            },
            {
              source: tarballPaths[1],
              target: '/app/fixtures/eslint-plugin-loderunner.tgz',
            },
          ])
          .withCopyDirectoriesToContainer([
            {
              source: join(fixturesRoot, 'oxlint-project'),
              target: '/app/fixtures',
            },
            { source: join(fixturesRoot, 'src'), target: '/app/fixtures/src' },
          ])
          .withWorkingDir('/app/fixtures')
          .start(),
        new GenericContainer('node:24-slim')
          .withCommand(['sleep', 'infinity'])
          .withCopyFilesToContainer([
            {
              source: tarballPaths[1],
              target: '/app/fixtures/eslint-plugin-loderunner.tgz',
            },
            {
              source: tarballPaths[2],
              target: '/app/fixtures/eslint-config-loderunner.tgz',
            },
          ])
          .withCopyDirectoriesToContainer([
            {
              source: join(fixturesRoot, 'eslint-project'),
              target: '/app/fixtures',
            },
            { source: join(fixturesRoot, 'src'), target: '/app/fixtures/src' },
          ])
          .withWorkingDir('/app/fixtures')
          .start(),
      ]);

      await Promise.all(
        [oxlintContainer, eslintContainer].map(async (container) => {
          const { stdout, stderr, exitCode } = await container.exec([
            'npm',
            'install',
          ]);
          if (exitCode !== 0) {
            console.error('npm install failed:');
            console.error(stdout);
            console.error(stderr);
            throw new Error(`npm install exited with code ${exitCode}`);
          }
        }),
      );
    },
    5 * 60 * 1000,
  );

  afterAll(async () => {
    await Promise.all(
      [oxlintContainer, eslintContainer].map((container) => container?.stop()),
    );
    for (const tarballPath of tarballPaths ?? []) {
      try {
        unlinkSync(tarballPath);
      } catch {
        // Ignore cleanup errors
      }
    }
  });

  it(
    'mapping ESLint findings through shared/rule-map.js matches oxlint findings, modulo documented exceptions',
    async () => {
      // oxlint side
      const printConfigResult = await oxlintContainer.exec([
        'npx',
        'oxlint',
        '--print-config',
        '.',
      ]);
      expect(printConfigResult.exitCode).toBe(0);
      const enabledFromPrintConfig = collectEnabledRuleIds(
        JSON.parse(printConfigResult.stdout),
      );
      // Cross-check `targetRuleIds` against `--print-config` (see the same
      // check in violations.test.js) - not used to compute the exclusion
      // set below, since `--print-config` doesn't always agree with actual
      // firing behavior (violations.test.js found a rule,
      // `vitest/require-to-throw-message`, that fires without
      // `--print-config` ever listing it as enabled).
      const targetRuleIdsNotEnabled = targetRuleIds.filter(
        (ruleId) => !enabledFromPrintConfig.has(ruleId),
      );
      expect(targetRuleIdsNotEnabled).toEqual([]);

      const oxlintLintResult = await oxlintContainer.exec([
        'npx',
        'oxlint',
        '--type-aware',
        '-f',
        'json',
        '.',
      ]);
      const oxlintReport = JSON.parse(oxlintLintResult.stdout);
      const oxlintFindingIds = new Set(
        oxlintReport.diagnostics
          .filter((diagnostic) => diagnostic.filename !== 'tsconfig.json')
          .map((diagnostic) => ruleIdFromDiagnosticCode(diagnostic.code)),
      );

      // ESLint side
      const eslintLintResult = await eslintContainer.exec([
        'npx',
        'eslint',
        '-f',
        'json',
        '.',
      ]);
      const eslintReport = JSON.parse(eslintLintResult.stdout);
      const eslintFindingIds = new Set();
      for (const fileResult of eslintReport) {
        for (const message of fileResult.messages) {
          if (message.ruleId) {
            eslintFindingIds.add(message.ruleId);
          }
        }
      }
      // Sanity: the fixture tree must have actually produced ESLint
      // findings, or every assertion below would pass vacuously.
      expect(eslintFindingIds.size).toBeGreaterThan(0);

      const unhandledEslintRuleIds = [];
      const mappedFromEslint = new Set();
      const expectedEslintOnly = new Set();
      for (const ruleId of eslintFindingIds) {
        const mapped = mapEslintRuleToOxlint(ruleId);
        if (mapped === undefined) {
          unhandledEslintRuleIds.push(ruleId);
        } else if (mapped === null) {
          expectedEslintOnly.add(ruleId);
        } else {
          mappedFromEslint.add(mapped);
        }
      }
      // Every ESLint finding must be explicitly classified (mapped, or
      // documented as ESLint-only) - an unhandled id would mean the
      // exclusion logic is silently swallowing something instead of
      // accounting for it, which is exactly what the task warns against.
      expect(unhandledEslintRuleIds).toEqual([]);

      // Non-vacuousness check: this fixture tree includes
      // react-jsx-sort-props.tsx specifically to exercise the "expected
      // ESLint-only" path (shared/rule-map.js marks
      // `react/jsx-sort-props: { oxlint: null }` - no oxlint equivalent).
      expect(expectedEslintOnly.has('react/jsx-sort-props')).toBe(true);

      // Both sides are filtered down to `targetRuleIds` - this package's own
      // documented, managed rule surface (plan Part 4/6) - excluding
      // anything either tool enables in bulk that this comparison was never
      // meant to cover: on the oxlint side, ~100+ default-plugin
      // `correctness` members from `unicorn`/`oxc`/etc (see
      // violations.test.js); on the ESLint side, bulk-inherited
      // `eslint:recommended` / `recommendedTypeChecked` members this
      // fixture tree happens to also trip (`no-undef`, `no-useless-assignment`
      // - found empirically, neither is part of any preset's own `rules.js`
      // or this package's `oxlintOnly` additions on either side).
      const mappedFromEslintInScope = [...mappedFromEslint].filter((ruleId) =>
        targetRuleIds.includes(ruleId),
      );
      const oxlintFindingsInScope = [...oxlintFindingIds].filter(
        (ruleId) =>
          targetRuleIds.includes(ruleId) && !oxlintOnlyNoEslintPair.has(ruleId),
      );

      expect(mappedFromEslintInScope.sort()).toEqual(
        oxlintFindingsInScope.sort(),
      );
    },
    6 * 60 * 1000,
  );
});
