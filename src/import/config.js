import importPlugin from 'eslint-plugin-import';

import importRules from './rules.js';

/**
 * Auto-detect if eslint-import-resolver-typescript is installed.
 * If available, enables TypeScript resolver automatically.
 */
let typescriptResolverAvailable = false;
try {
  await import('eslint-import-resolver-typescript');
  typescriptResolverAvailable = true;
} catch {
  // Not installed, skip TypeScript resolver
}

/**
 * Import ordering ESLint config with plugin, settings, and custom rules.
 * Includes eslint-plugin-import with Node resolver. TypeScript resolver is
 * auto-enabled if eslint-import-resolver-typescript is installed.
 *
 * @type {import('eslint').Linter.Config[]}
 */
const importConfig = [
  {
    plugins: { import: importPlugin },
    settings: {
      'import/resolver': {
        ...(typescriptResolverAvailable && { typescript: true }),
        node: true,
      },
    },
    rules: importRules,
  },
];

export default importConfig;
