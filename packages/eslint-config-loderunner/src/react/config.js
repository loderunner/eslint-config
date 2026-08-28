import { createRequire } from 'node:module';
import { join } from 'node:path';
import process from 'node:process';

import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

import reactRules from './rules.js';

// 'detect' calls context.getFilename(), removed in ESLint 10; resolve eagerly instead.
function detectReactVersion() {
  const requireFromCwd = createRequire(join(process.cwd(), 'package.json'));
  try {
    return requireFromCwd('react/package.json').version;
  } catch {
    return '999.999.999'; // eslint-plugin-react's ULTIMATE_LATEST_SEMVER
  }
}

/**
 * React ESLint config with recommended rules and custom rules.
 * Includes eslint-plugin-react and eslint-plugin-react-hooks recommended configs.
 *
 * @type {import('eslint').Linter.Config[]}
 */
const reactConfig = [
  { settings: { react: { version: detectReactVersion() } } },
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  { rules: reactRules },
];

export default reactConfig;
