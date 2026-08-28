#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import { URL, fileURLToPath } from 'node:url';

import * as prettier from 'prettier';

import oxfmtConfig from '../packages/oxc-config-loderunner/src/oxfmt/index.js';
import {
  base,
  react,
  typescript,
  vitest,
} from '../packages/oxc-config-loderunner/src/oxlint/index.js';

const packageRoot = fileURLToPath(
  new URL('../packages/oxc-config-loderunner/', import.meta.url),
);

/**
 * Serializes a plain config object to a committed JSON artifact, formatted
 * through this repo's own Prettier config so `pnpm run generate:oxc && git
 * diff --exit-code` and `pnpm run lint` never disagree about formatting.
 * Pure serialization only — no merging, no defaults filled in — every
 * fragment object is already complete by the time it reaches this function.
 *
 * @param relativePath Destination path, relative to
 * `packages/oxc-config-loderunner/`.
 * @param data The already-complete config object to serialize.
 */
async function writeJson(relativePath, data) {
  const filepath = `${packageRoot}${relativePath}`;
  const contents = await prettier.format(JSON.stringify(data), {
    ...(await prettier.resolveConfig(filepath)),
    filepath,
  });
  writeFileSync(filepath, contents, 'utf8');
}

mkdirSync(`${packageRoot}oxlint`, { recursive: true });

await writeJson('oxlint/base.json', base);
await writeJson('oxlint/typescript.json', typescript);
await writeJson('oxlint/react.json', react);
await writeJson('oxlint/vitest.json', vitest);
await writeJson('oxfmt.json', oxfmtConfig);

process.stdout.write(
  'Generated packages/oxc-config-loderunner/{oxlint/*.json,oxfmt.json}\n',
);
