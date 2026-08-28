import { execSync } from 'node:child_process';
import { readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { GenericContainer } from 'testcontainers';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const packageRoot = fileURLToPath(new URL('../..', import.meta.url));
const pluginPackageRoot = join(packageRoot, '../eslint-plugin-loderunner');

// eslint-plugin-loderunner is a real (unpublished) dependency referenced via
// jsPlugins, so every fixture needs both tarballs installed side by side.
// eslint-config-loderunner is *not* pulled in here - this suite has nothing
// to do with the ESLint side of the package.
const packagesToPack = [
  { root: packageRoot, prefix: 'oxc-config-loderunner-' },
  { root: pluginPackageRoot, prefix: 'eslint-plugin-loderunner-' },
];

// Two mutually exclusive consumer paths (Part 1 / Q1 of the plan):
//
// - `oxlint.config.ts`'s `extends` accepts imported config *objects* and is
//   the primary, documented path. It requires the Node-based `oxlint` npm
//   package and Node v22.18+/v24+, so it is exercised on `node:24-slim`.
// - `.oxlintrc.json`'s `extends` only accepts relative file paths into
//   `node_modules` and cannot reach a package import at all. It works with
//   any Node version (and the standalone binary), so it's exercised here on
//   `node:22-slim` to cover a different version axis than the first variant.
const objectImportKey = 'object-import';
const jsonExtendsKey = 'json-extends';
const variants = [
  {
    key: objectImportKey,
    fixtureDir: 'fixtures-clean/oxlint-config-ts',
    nodeVersion: '24',
  },
  {
    key: jsonExtendsKey,
    fixtureDir: 'fixtures-clean/oxlintrc-json',
    nodeVersion: '22',
  },
];

describe('acceptance test: clean install', () => {
  let tarballPaths;
  const containers = {};
  const printConfigs = {};

  beforeAll(async () => {
    tarballPaths = packagesToPack.map(({ root, prefix }) => {
      // Pack the package on the host
      execSync('pnpm pack', { cwd: root });

      // Find the generated tarball
      const files = readdirSync(root);
      const tarball = files.find(
        (file) => file.startsWith(prefix) && file.endsWith('.tgz'),
      );
      if (!tarball) {
        throw new Error(`Failed to find generated tarball for ${prefix}`);
      }
      return join(root, tarball);
    });

    // Start one container per variant, each with its own fixture directory
    // and Node version copied in.
    await Promise.all(
      variants.map(async ({ key, fixtureDir, nodeVersion }) => {
        containers[key] = await new GenericContainer(`node:${nodeVersion}-slim`)
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
              source: join(packageRoot, 'test/acceptance', fixtureDir),
              target: '/app/fixtures',
            },
          ])
          .withWorkingDir('/app/fixtures')
          .start();
      }),
    );
  });

  afterAll(async () => {
    await Promise.all(
      Object.values(containers).map((container) => container?.stop()),
    );
    for (const tarballPath of tarballPaths ?? []) {
      try {
        unlinkSync(tarballPath);
      } catch {
        // Ignore cleanup errors
      }
    }
  });

  describe('oxlint.config.ts (object-import extends)', () => {
    it(
      'installs dependencies, lints clean, and formats clean',
      async () => {
        const container = containers[objectImportKey];

        // Install dependencies
        {
          const { stdout, stderr, exitCode } = await container.exec([
            'npm',
            'install',
          ]);
          if (exitCode !== 0) {
            console.error('npm install failed:');
            console.error();
            console.error('STDOUT:');
            console.error(stdout);
            console.error();
            console.error('STDERR:');
            console.error(stderr);
          }
          expect(exitCode).toBe(0);
        }

        // Run oxlint with type-aware linting enabled
        {
          const { stdout, stderr, exitCode } = await container.exec([
            'npx',
            'oxlint',
            '--type-aware',
            '.',
          ]);
          if (exitCode !== 0) {
            console.error('oxlint failed:');
            console.error();
            console.error('STDOUT:');
            console.error(stdout);
            console.error();
            console.error('STDERR:');
            console.error(stderr);
          }
          expect(exitCode).toBe(0);
        }

        // Run oxfmt --check
        {
          const { stdout, stderr, exitCode } = await container.exec([
            'npx',
            'oxfmt',
            '--check',
            '.',
          ]);
          if (exitCode !== 0) {
            console.error('oxfmt --check failed:');
            console.error();
            console.error('STDOUT:');
            console.error(stdout);
            console.error();
            console.error('STDERR:');
            console.error(stderr);
          }
          expect(exitCode).toBe(0);
        }

        // Capture the resolved config for the cross-variant comparison
        // below (Part 9 item 6).
        {
          const { stdout, stderr, exitCode } = await container.exec([
            'npx',
            'oxlint',
            '--print-config',
            '.',
          ]);
          if (exitCode !== 0) {
            console.error('oxlint --print-config failed:');
            console.error();
            console.error('STDOUT:');
            console.error(stdout);
            console.error();
            console.error('STDERR:');
            console.error(stderr);
          }
          expect(exitCode).toBe(0);
          printConfigs[objectImportKey] = JSON.parse(stdout);
        }
      },
      5 * 60 * 1000,
    );
  });

  describe('.oxlintrc.json (relative-path extends)', () => {
    it(
      'installs dependencies, lints clean, and formats clean',
      async () => {
        const container = containers[jsonExtendsKey];

        // Install dependencies
        {
          const { stdout, stderr, exitCode } = await container.exec([
            'npm',
            'install',
          ]);
          if (exitCode !== 0) {
            console.error('npm install failed:');
            console.error();
            console.error('STDOUT:');
            console.error(stdout);
            console.error();
            console.error('STDERR:');
            console.error(stderr);
          }
          expect(exitCode).toBe(0);
        }

        // Run oxlint with type-aware linting enabled
        {
          const { stdout, stderr, exitCode } = await container.exec([
            'npx',
            'oxlint',
            '--type-aware',
            '.',
          ]);
          if (exitCode !== 0) {
            console.error('oxlint failed:');
            console.error();
            console.error('STDOUT:');
            console.error(stdout);
            console.error();
            console.error('STDERR:');
            console.error(stderr);
          }
          expect(exitCode).toBe(0);
        }

        // Run oxfmt --check
        {
          const { stdout, stderr, exitCode } = await container.exec([
            'npx',
            'oxfmt',
            '--check',
            '.',
          ]);
          if (exitCode !== 0) {
            console.error('oxfmt --check failed:');
            console.error();
            console.error('STDOUT:');
            console.error(stdout);
            console.error();
            console.error('STDERR:');
            console.error(stderr);
          }
          expect(exitCode).toBe(0);
        }

        // Capture the resolved config for the cross-variant comparison
        // below (Part 9 item 6).
        {
          const { stdout, stderr, exitCode } = await container.exec([
            'npx',
            'oxlint',
            '--print-config',
            '.',
          ]);
          if (exitCode !== 0) {
            console.error('oxlint --print-config failed:');
            console.error();
            console.error('STDOUT:');
            console.error(stdout);
            console.error();
            console.error('STDERR:');
            console.error(stderr);
          }
          expect(exitCode).toBe(0);
          printConfigs[jsonExtendsKey] = JSON.parse(stdout);
        }
      },
      5 * 60 * 1000,
    );
  });

  it('--print-config resolves categories, plugins, jsPlugins and rules identically across both consumer paths', () => {
    const configA = printConfigs[objectImportKey];
    const configB = printConfigs[jsonExtendsKey];

    // Sanity check: both variants must have actually captured a config (i.e.
    // the `it` blocks above ran and succeeded).
    expect(configA).toBeDefined();
    expect(configB).toBeDefined();

    // This is the empirical settlement of Part 10 item 6 (rule-option merge
    // depth across `extends`): if the object-import path and the JSON
    // file-path path produced different merged rules, plugins or
    // categories, the two documented consumer paths in the README would not
    // actually be equivalent.
    expect(configA.categories).toEqual(configB.categories);
    expect(configA.plugins).toEqual(configB.plugins);
    expect(configA.jsPlugins).toEqual(configB.jsPlugins);
    expect(configA.rules).toEqual(configB.rules);
  });
});
