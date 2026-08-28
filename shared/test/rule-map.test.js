import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import ruleMap from '../rule-map.js';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

const inventory = JSON.parse(
  readFileSync(new URL('../oxlint-rule-inventory.json', import.meta.url)),
).rules;

const rulesJsGlob = [
  'base',
  'typescript',
  'react',
  'vitest',
  'formatting',
  'import',
  'jsdoc',
  'vue',
  'tailwindcss',
].map(
  (preset) =>
    `${repoRoot}/packages/eslint-config-loderunner/src/${preset}/rules.js`,
);

/**
 * oxc-config-loderunner fragments (packages/oxc-config-loderunner/src/oxlint/*.js)
 * may each export an `oxlintOnly` map of rules that exist only on the oxc
 * side (no ESLint-side counterpart to derive from). Every entry must carry a
 * one-line justification, and any entry whose severity is "off" must
 * correspond to a rule the inventory marks `correctness` (otherwise it's
 * already off by default and the line is a no-op that should be deleted).
 *
 * This list is empty until packages/oxc-config-loderunner exists, in which
 * case the checks below trivially pass with zero fragments scanned.
 */
async function loadOxlintOnlyFragments() {
  const oxlintDir = `${repoRoot}/packages/oxc-config-loderunner/src/oxlint`;
  let entries;
  try {
    entries = readdirSync(oxlintDir).filter((f) => f.endsWith('.js'));
  } catch {
    return [];
  }
  return Promise.all(
    entries.map(async (file) => {
      const mod = await import(`${oxlintDir}/${file}`);
      return { file, oxlintOnly: mod.oxlintOnly ?? {} };
    }),
  );
}

describe('shared/rule-map.js drift test', () => {
  it('maps every rule declared in a preset rules.js file', async () => {
    const missing = [];
    for (const path of rulesJsGlob) {
      const mod = await import(path);
      for (const ruleName of Object.keys(mod.default)) {
        if (!(ruleName in ruleMap)) {
          missing.push(`${path}: ${ruleName}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('points every non-null mapping at a rule the inventory knows about', () => {
    const unknown = Object.entries(ruleMap)
      .filter(([, entry]) => entry.oxlint !== null)
      .filter(([, entry]) => !(entry.oxlint in inventory))
      .map(([eslintRule, entry]) => `${eslintRule} -> ${entry.oxlint}`);
    expect(unknown).toEqual([]);
  });

  it('requires a reason for every dropped (null) mapping', () => {
    const unexplained = Object.entries(ruleMap)
      .filter(([, entry]) => entry.oxlint === null)
      .filter(([, entry]) => !entry.reason || entry.reason.trim() === '')
      .map(([eslintRule]) => eslintRule);
    expect(unexplained).toEqual([]);
  });

  it('requires a justification for every oxlintOnly addition', async () => {
    const fragments = await loadOxlintOnlyFragments();
    const unjustified = [];
    for (const { file, oxlintOnly } of fragments) {
      for (const [ruleId, entry] of Object.entries(oxlintOnly)) {
        if (!entry.justification || entry.justification.trim() === '') {
          unjustified.push(`${file}: ${ruleId}`);
        }
      }
    }
    expect(unjustified).toEqual([]);
  });

  it('rejects an oxlintOnly rule set to "off" unless it is actually a correctness rule', async () => {
    const fragments = await loadOxlintOnlyFragments();
    const noops = [];
    for (const { file, oxlintOnly } of fragments) {
      for (const [ruleId, entry] of Object.entries(oxlintOnly)) {
        const severity = Array.isArray(entry.severity)
          ? entry.severity[0]
          : entry.severity;
        if (severity !== 'off') {
          continue;
        }
        const inventoryEntry = inventory[ruleId];
        if (!inventoryEntry || inventoryEntry.category !== 'correctness') {
          noops.push(`${file}: ${ruleId}`);
        }
      }
    }
    expect(noops).toEqual([]);
  });
});
