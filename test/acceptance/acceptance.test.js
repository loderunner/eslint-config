import { execSync } from 'node:child_process';
import { readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

import { GenericContainer } from 'testcontainers';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('acceptance test', () => {
  let container;
  let tarballPath;

  beforeAll(async () => {
    // Pack the package on the host
    execSync('pnpm pack', { cwd: process.cwd() });

    // Find the generated tarball
    const files = readdirSync(process.cwd());
    const tarball = files.find(
      (file) =>
        file.startsWith('eslint-config-loderunner-') && file.endsWith('.tgz'),
    );
    if (!tarball) {
      throw new Error('Failed to find generated tarball');
    }
    tarballPath = join(process.cwd(), tarball);

    // Start container
    container = await new GenericContainer('node:24.10-slim')
      .withCommand(['sleep', 'infinity'])
      .withCopyFilesToContainer([
        {
          source: tarballPath,
          target: '/app/fixtures/eslint-config-loderunner.tgz',
        },
      ])
      .withCopyDirectoriesToContainer([
        {
          source: join(process.cwd(), 'test/acceptance/fixtures'),
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
    if (tarballPath) {
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
