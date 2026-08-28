import { execSync } from 'node:child_process';
import { readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { GenericContainer } from 'testcontainers';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  collectEnabledRuleIds,
  knownGaps,
  ruleIdFromDiagnosticCode,
  targetRuleIds,
} from './violation-rule-sets.js';

const packageRoot = fileURLToPath(new URL('../..', import.meta.url));
const pluginPackageRoot = join(packageRoot, '../eslint-plugin-loderunner');
const fixturesRoot = join(packageRoot, 'test/acceptance/fixtures-violations');

const packagesToPack = [
  { root: packageRoot, prefix: 'oxc-config-loderunner-' },
  { root: pluginPackageRoot, prefix: 'eslint-plugin-loderunner-' },
];

describe('acceptance test: violation fixtures (plan Part 9 items 7 and 9)', () => {
  let container;
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

      // `oxlint.config.ts` needs the Node-based oxlint package and Node
      // v22.18+/v24+ (plan Part 1, Q1) - use node:24-slim to match the rest
      // of this package's acceptance suite.
      container = await new GenericContainer('node:24-slim')
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
          {
            source: join(fixturesRoot, 'src'),
            target: '/app/fixtures/src',
          },
        ])
        .withWorkingDir('/app/fixtures')
        .start();

      {
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
      }
    },
    5 * 60 * 1000,
  );

  afterAll(async () => {
    if (container) {
      await container.stop();
    }
    for (const tarballPath of tarballPaths ?? []) {
      try {
        unlinkSync(tarballPath);
      } catch {
        // Ignore cleanup errors
      }
    }
  });

  it(
    '`oxlint --help` documents the exact flags this suite relies on',
    async () => {
      // Part 9 item 7's own instructions: check the flag/format name via
      // `--help` inside the container rather than assuming.
      const { stdout, exitCode } = await container.exec([
        'npx',
        'oxlint',
        '--help',
      ]);
      expect(exitCode).toBe(0);
      expect(stdout).toContain('--type-aware');
      expect(stdout).toMatch(/`json`/);
      expect(stdout).toContain('--print-config');
    },
    5 * 60 * 1000,
  );

  it(
    'every rule this package enables fires on the violation fixtures, and no undocumented rule is missing',
    async () => {
      // Ground truth for "which rules are actually enabled", per the task:
      // merge `--print-config`'s top-level `rules` with every `overrides[]`
      // entry's `rules` (severities are `allow`/`warn`/`deny` in this raw
      // form). A rule id is "enabled" if it is non-`allow` *anywhere* in the
      // tree - matching how oxlint actually resolves rules per file.
      const printConfigResult = await container.exec([
        'npx',
        'oxlint',
        '--print-config',
        '.',
      ]);
      expect(printConfigResult.exitCode).toBe(0);
      const printConfig = JSON.parse(printConfigResult.stdout);
      const enabledFromPrintConfig = collectEnabledRuleIds(printConfig);

      // Cross-check `targetRuleIds` against `--print-config`'s own view of
      // what's enabled - catches a typo'd/stale rule id in `targetRuleIds`
      // (everything in it should be enabled; `loderunner/no-chained-arrow`
      // is added to `enabledFromPrintConfig` by hand, see
      // `collectEnabledRuleIds`, since JS-plugin rules never appear in
      // `--print-config`'s own output).
      const targetRuleIdsNotEnabled = targetRuleIds.filter(
        (ruleId) => !enabledFromPrintConfig.has(ruleId),
      );
      expect(targetRuleIdsNotEnabled).toEqual([]);

      const lintResult = await container.exec([
        'npx',
        'oxlint',
        '--type-aware',
        '-f',
        'json',
        '.',
      ]);
      // oxlint exits non-zero when it reports any error-severity diagnostic,
      // which every one of these fixtures is designed to do - only check
      // that it actually ran (produced parseable JSON), not the exit code.
      const report = JSON.parse(lintResult.stdout);
      const reportedRuleIds = new Set(
        report.diagnostics
          .filter((diagnostic) => diagnostic.filename !== 'tsconfig.json')
          .map((diagnostic) => ruleIdFromDiagnosticCode(diagnostic.code)),
      );

      // Item 9: loderunner/no-chained-arrow (a non-type-aware JS plugin
      // rule) must fire correctly while --type-aware is active.
      expect(reportedRuleIds.has('loderunner/no-chained-arrow')).toBe(true);

      // Rules reported that this package's fragments never mention - i.e.
      // everything that fired that isn't part of this package's own
      // documented, managed rule set (default-plugin `correctness` members
      // from `unicorn`, `oxc`, and the rest of `eslint`/`typescript`/
      // `react` beyond plan Part 4, plus at least one case
      // (`vitest/require-to-throw-message`, fired by
      // `vitest-no-unneeded-async-expect-function.test.ts`'s
      // `.rejects.toThrow()` with no message) that `--print-config` didn't
      // even list as enabled - another undocumented-in-the-guide oxlint
      // quirk, Part 10 territory). The README says as much about this
      // whole category (Part 6: "unicorn and oxc plugins are in oxlint's
      // default plugin set... kept, but say so") - individually
      // fixture-covering every one of them was out of reasonable scope
      // here, so anything not in `targetRuleIds` is excluded wholesale,
      // rather than requiring `--print-config` to independently corroborate
      // the exclusion - the require-to-throw-message case above shows that
      // cannot be relied on.
      const outOfScopeRuleIds = [...reportedRuleIds].filter(
        (ruleId) => !targetRuleIds.includes(ruleId),
      );

      const expectedFiring = targetRuleIds
        .filter((ruleId) => !knownGaps.includes(ruleId))
        .sort();
      const actualFiring = [...reportedRuleIds]
        .filter((ruleId) => !outOfScopeRuleIds.includes(ruleId))
        .sort();

      expect(actualFiring).toEqual(expectedFiring);

      // Sanity check on the known-gaps bookkeeping itself: a rule only
      // belongs in `knownGaps` if it genuinely never fires. If either
      // starts firing (e.g. a future oxlint release fixes the gap), this
      // fails loudly as a prompt to remove it from `knownGaps`.
      for (const gap of knownGaps) {
        expect(reportedRuleIds.has(gap)).toBe(false);
      }
    },
    6 * 60 * 1000,
  );
});
