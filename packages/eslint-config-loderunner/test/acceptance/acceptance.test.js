import { execSync } from 'node:child_process';
import { readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { GenericContainer } from 'testcontainers';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const eslintMajor = process.env.ESLINT_VERSION;
const nodeVersion = process.env.NODE_VERSION || '24';

const packageRoot = fileURLToPath(new URL('../..', import.meta.url));
const pluginPackageRoot = join(packageRoot, '../eslint-plugin-loderunner');

// eslint-plugin-loderunner is a real (unpublished) dependency of this
// package, so the fixture needs both tarballs installed side by side.
const packagesToPack = [
  { root: packageRoot, prefix: 'eslint-config-loderunner-' },
  { root: pluginPackageRoot, prefix: 'eslint-plugin-loderunner-' },
];

describe('acceptance test', () => {
  let container;
  let tarballPaths;

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

    // Start container
    container = await new GenericContainer(`node:${nodeVersion}-slim`)
      .withCommand(['sleep', 'infinity'])
      .withCopyFilesToContainer([
        {
          source: tarballPaths[0],
          target: '/app/fixtures/eslint-config-loderunner.tgz',
        },
        {
          source: tarballPaths[1],
          target: '/app/fixtures/eslint-plugin-loderunner.tgz',
        },
      ])
      .withCopyDirectoriesToContainer([
        {
          source: join(packageRoot, 'test/acceptance/fixtures'),
          target: '/app/fixtures',
        },
      ])
      .withWorkingDir('/app/fixtures')
      .start();
  });

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
    'should install dependencies and run eslint successfully',
    async () => {
      // Install dependencies, pinning eslint/@eslint/js when ESLINT_VERSION is set
      {
        const installCommand =
          eslintMajor === undefined || eslintMajor === ''
            ? ['npm', 'install']
            : [
                'npm',
                'install',
                '--save-dev',
                `eslint@^${eslintMajor}`,
                `@eslint/js@^${eslintMajor}`,
              ];
        const { stdout, stderr, exitCode } =
          await container.exec(installCommand);
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

      // Guard against silently testing the wrong version when pinned
      {
        const { stdout, exitCode } = await container.exec([
          'npx',
          'eslint',
          '--version',
        ]);
        expect(exitCode).toBe(0);
        expect(stdout.trim()).toMatch(
          eslintMajor ? new RegExp(`^v${eslintMajor}\\.`) : /^v\d+\./,
        );
      }

      // Run eslint
      {
        const { stdout, stderr, exitCode } = await container.exec([
          'npx',
          'eslint',
          '.',
        ]);
        if (exitCode !== 0) {
          console.error('eslint failed:');
          console.error();

          console.error('STDOUT:');
          console.error(stdout);
          console.error();

          console.error('STDERR:');
          console.error(stderr);
        }
        expect(exitCode).toBe(0);
      }
    },
    5 * 60 * 1000,
  );
});
