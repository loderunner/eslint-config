# eslint-config-loderunner

Reusable ESLint flat configs for TypeScript, React, Vitest, and more. Composable and modular—pick only what you need.

## Installation

```bash
pnpm add -D eslint-config-loderunner
```

Install peer dependencies based on which configs you use (see each config's requirements below).

## Usage

Import the configs you need and compose them in your `eslint.config.js`:

```js
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import { configs } from 'eslint-config-loderunner';

export default [
  { files: ['**/*.{js,ts}'] },
  { ignores: ['dist/**/*', 'node_modules/**/*'] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.config.js'],
        },
      },
    },
  },
  configs.base,
  configs.typescript,
  configs.importOrder,
  prettierConfig,
  configs.formatting, // Must be last
];
```

## Available Configs

### `base`

Core JavaScript rules.

**Rules:**
- `eqeqeq: 'error'` - Require strict equality
- `no-duplicate-imports: 'error'` - Disallow duplicate imports

**Peer dependencies:** None (uses built-in ESLint rules)

---

### `typescript`

TypeScript-specific rules. Assumes you've set up `typescript-eslint` with type-checked linting.

**Rules:**
- `@typescript-eslint/no-unused-vars` - Error on unused vars, with `_` prefix pattern ignored
- `@typescript-eslint/switch-exhaustiveness-check` - Warn on non-exhaustive switches
- `@typescript-eslint/strict-boolean-expressions` - Require explicit boolean expressions
- `@typescript-eslint/prefer-nullish-coalescing` - Prefer `??` over `||`
- `@typescript-eslint/no-unnecessary-condition` - Warn on always-truthy/falsy conditions
- `@typescript-eslint/no-misused-promises` - Error on misused promises (void return allowed)
- `@typescript-eslint/consistent-type-imports` - Enforce inline type imports
- Disables: `no-explicit-any`, `unbound-method`, `prefer-promise-reject-errors`, `require-await`

**Peer dependencies:**
```bash
pnpm add -D typescript-eslint
```

**Recommended setup:**
```js
import tseslint from 'typescript-eslint';
import { configs } from 'eslint-config-loderunner';

export default [
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.config.js'],
        },
      },
    },
  },
  configs.typescript,
];
```

---

### `importOrder`

Import ordering and organization.

**Rules:**
- `import/order` - Enforce alphabetized imports with newlines between groups

**Peer dependencies:**
```bash
pnpm add -D eslint-plugin-import
```

---

### `react`

React-specific rules. Assumes you've set up `eslint-plugin-react` and `eslint-plugin-react-hooks`.

**Rules:**
- `react/jsx-sort-props` - Sort JSX props (callbacks last, reserved first)

**Peer dependencies:**
```bash
pnpm add -D eslint-plugin-react eslint-plugin-react-hooks
```

**Recommended setup:**
```js
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { configs } from 'eslint-config-loderunner';

export default [
  {
    settings: {
      react: { version: 'detect' },
    },
  },
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  configs.react,
];
```

---

### `vitest`

Relaxed TypeScript rules for test files.

**Rules:**
- `@typescript-eslint/no-unsafe-assignment: 'off'`
- `@typescript-eslint/no-unsafe-member-access: 'off'`

**Peer dependencies:**
```bash
pnpm add -D @vitest/eslint-plugin
```

**Recommended setup:**
```js
import vitestPlugin from '@vitest/eslint-plugin';
import { configs } from 'eslint-config-loderunner';

export default [
  {
    files: ['**/*.test.ts'],
    ...vitestPlugin.configs.recommended,
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      ...configs.vitest.rules,
    },
  },
];
```

---

### `jsdoc`

JSDoc documentation rules for library projects.

**Rules:**
- `jsdoc/require-jsdoc` - Require JSDoc for public exports
- `jsdoc/check-alignment` - Check JSDoc alignment
- `jsdoc/check-indentation` - Check JSDoc indentation
- `jsdoc/multiline-blocks` - Enforce multiline JSDoc style
- `jsdoc/no-types` - Disallow types in JSDoc (use TypeScript)
- `jsdoc/require-description` - Require description in JSDoc

**Peer dependencies:**
```bash
pnpm add -D eslint-plugin-jsdoc
```

---

### `formatting`

Formatting rules that must be applied **last** in your config array, after any formatter configs like `eslint-config-prettier`.

**Rules:**
- `curly: ['error', 'all']` - Require braces for all control statements

**Why last?** Prettier configs disable `curly` to avoid conflicts. This re-enables it after.

**Peer dependencies:**
```bash
pnpm add -D eslint-config-prettier
```

---

## Example Configurations

### Node.js + TypeScript

```js
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import { configs } from 'eslint-config-loderunner';

export default [
  { files: ['**/*.{js,ts}'] },
  { ignores: ['dist/**/*'] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.config.js'],
        },
      },
    },
  },
  configs.base,
  configs.typescript,
  configs.importOrder,
  prettierConfig,
  configs.formatting,
];
```

### React + TypeScript

```js
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';
import { configs } from 'eslint-config-loderunner';

export default [
  { files: ['**/*.{js,ts,tsx}'] },
  { ignores: ['dist/**/*'] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.config.js'],
        },
      },
    },
  },
  {
    settings: {
      react: { version: 'detect' },
    },
  },
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  configs.base,
  configs.typescript,
  configs.importOrder,
  configs.react,
  prettierConfig,
  configs.formatting,
];
```

### Library with JSDoc

```js
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import { configs } from 'eslint-config-loderunner';

export default [
  { files: ['**/*.{js,ts}'] },
  { ignores: ['dist/**/*'] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.config.js'],
        },
      },
    },
  },
  configs.base,
  configs.typescript,
  configs.importOrder,
  configs.jsdoc,
  prettierConfig,
  configs.formatting,
];
```

## License

MIT
