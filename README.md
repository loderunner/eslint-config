# eslint-config-loderunner

Reusable ESLint flat configs for TypeScript, React, Vitest, and more.

This package provides modular ESLint configurations that you can mix and match.
Each config is available in two forms: **full configs** (includes plugins and
recommended rules) and **rules-only** exports (just the custom rules, for mixing
with your own setup).

- [Installation](#installation)
- [Configs](#configs)
  - [base](#base)
  - [typescript](#typescript)
  - [react](#react)
  - [Vue](#vue)
  - [import](#import)
  - [jsdoc](#jsdoc)
  - [vitest](#vitest)
  - [formatting](#formatting)
- [Example Project Configurations](#example-project-configurations)
  - [Vite + React Frontend](#vite--react-frontend)
  - [Node.js Backend/CLI](#nodejs-backendcli)
  - [Vue.js](#vuejs)
  - [Library](#library)

## Installation

```bash
npm install --save-dev eslint-config-loderunner
# or
pnpm add --save-dev eslint-config-loderunner
# or
yarn add --dev eslint-config-loderunner
```

## Configs

### base

Core JavaScript rules including strict equality, no `var`, and no duplicate
imports.

**Peer dependencies:** `@eslint/js`

**Rules-only usage:**

```javascript
import baseRules from 'eslint-config-loderunner/base/rules';

export default [
  {
    files: ['**/*.{js,mjs,cjs}'],
    rules: {
      ...baseRules,
    },
  },
];
```

**Full config usage:**

```javascript
import baseConfig from 'eslint-config-loderunner/base';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [baseConfig],
  },
]);
```

### typescript

TypeScript rules with type-checking enabled. Includes strict boolean
expressions, exhaustive switch checks, and consistent type imports.

**Peer dependencies:** `typescript-eslint`

**Rules-only usage:**

```javascript
import typescriptRules from 'eslint-config-loderunner/typescript/rules';

export default [
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      ...typescriptRules,
    },
  },
];
```

**Full config usage:**

```javascript
import typescriptConfig from 'eslint-config-loderunner/typescript';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{ts,tsx}'],
    extends: [typescriptConfig],
  },
]);
```

### react

React and React Hooks rules. Includes JSX prop sorting (reserved props first,
callbacks last).

**Peer dependencies:** `eslint-plugin-react`, `eslint-plugin-react-hooks`

**Rules-only usage:**

```javascript
import reactRules from 'eslint-config-loderunner/react/rules';

export default [
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      ...reactRules,
    },
  },
];
```

**Full config usage:**

```javascript
import reactConfig from 'eslint-config-loderunner/react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{jsx,tsx}'],
    extends: [reactConfig],
  },
]);
```

### Vue

Vue.js rules.

**Peer dependencies:** `eslint-plugin-vue`

**Rules-only usage:**

```javascript
import vueRules from 'eslint-config-loderunner/vue/rules';

export default [
  {
    files: ['**/*.vue'],
    rules: {
      ...vueRules,
    },
  },
];
```

**Full config usage:**

```javascript
import vueConfig from 'eslint-config-loderunner/vue';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.vue'],
    extends: [vueConfig],
  },
]);
```

### import

Import ordering and organization rules. Enforces alphabetical sorting with
newlines between groups.

**Peer dependencies:** `eslint-plugin-import`

**Rules-only usage:**

```javascript
import importRules from 'eslint-config-loderunner/import/rules';

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    rules: {
      ...importRules,
    },
  },
];
```

**Full config usage:**

```javascript
import importConfig from 'eslint-config-loderunner/import';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    extends: [importConfig],
  },
]);
```

### jsdoc

JSDoc documentation rules. Requires JSDoc for public exports, enforces
consistent formatting, and disallows types in JSDoc (prefer TypeScript).

**Peer dependencies:** `eslint-plugin-jsdoc`

**Rules-only usage:**

```javascript
import jsdocRules from 'eslint-config-loderunner/jsdoc/rules';

export default [
  {
    files: ['**/*.{js,ts}'],
    rules: {
      ...jsdocRules,
    },
  },
];
```

**Full config usage:**

```javascript
import jsdocConfig from 'eslint-config-loderunner/jsdoc';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,ts}'],
    extends: [jsdocConfig],
  },
]);
```

### vitest

Vitest-specific rules for test files. Relaxes strict TypeScript rules for test
flexibility (allows `any`, unbound methods, etc.).

**Peer dependencies:** `@vitest/eslint-plugin`

**Rules-only usage:**

```javascript
import vitestRules from 'eslint-config-loderunner/vitest/rules';

export default [
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      ...vitestRules,
    },
  },
];
```

**Full config usage:**

```javascript
import vitestConfig from 'eslint-config-loderunner/vitest';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    extends: [vitestConfig],
  },
]);
```

### formatting

Formatting rules that work with Prettier. Includes `eslint-config-prettier` and
re-enables formatting rules like `curly` (require braces). **Must be applied
last** in your config array.

**Peer dependencies:** `eslint-config-prettier`

**Rules-only usage:**

```javascript
import formattingRules from 'eslint-config-loderunner/formatting/rules';

export default [
  // ... your other configs first
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    rules: {
      ...formattingRules, // Must be last
    },
  },
];
```

**Full config usage:**

```javascript
import formattingConfig from 'eslint-config-loderunner/formatting';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // ... your other configs first
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    extends: [formattingConfig], // Must be last
  },
]);
```

## Example Project Configurations

### Vite + React Frontend

```javascript
import baseConfig from 'eslint-config-loderunner/base';
import typescriptConfig from 'eslint-config-loderunner/typescript';
import reactConfig from 'eslint-config-loderunner/react';
import importConfig from 'eslint-config-loderunner/import';
import formattingConfig from 'eslint-config-loderunner/formatting';

export default [
  { files: ['src/**/*.{js,jsx,ts,tsx}'] },
  { ignores: ['dist', 'node_modules'] },
  ...baseConfig,
  ...typescriptConfig,
  ...reactConfig,
  ...importConfig,
  ...formattingConfig,
];
```

### Node.js Backend/CLI

```javascript
import baseConfig from 'eslint-config-loderunner/base';
import typescriptConfig from 'eslint-config-loderunner/typescript';
import importConfig from 'eslint-config-loderunner/import';
import formattingConfig from 'eslint-config-loderunner/formatting';

export default [
  { files: ['src/**/*.{js,ts}'] },
  { ignores: ['node_modules', 'dist'] },
  ...baseConfig,
  ...typescriptConfig,
  ...importConfig,
  ...formattingConfig,
];
```

### Vue.js

```javascript
import globals from 'globals';
import baseConfig from 'eslint-config-loderunner/base';
import vueConfig from 'eslint-config-loderunner/vue';
import importConfig from 'eslint-config-loderunner/import';
import formattingConfig from 'eslint-config-loderunner/formatting';

export default [
  {
    files: ['src/**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  { files: ['src/**/*.{js,mjs,cjs,vue}'] },
  { ignores: ['dist', 'node_modules'] },
  ...baseConfig,
  ...typescriptConfig,
  ...vueConfig,
  ...importConfig,
  ...formattingConfig,
];
```

### Library

```javascript
import baseConfig from 'eslint-config-loderunner/base';
import typescriptConfig from 'eslint-config-loderunner/typescript';
import importConfig from 'eslint-config-loderunner/import';
import jsdocConfig from 'eslint-config-loderunner/jsdoc';
import vitestConfig from 'eslint-config-loderunner/vitest';
import formattingConfig from 'eslint-config-loderunner/formatting';

export default [
  { files: ['src/**/*.{js,ts}'] },
  { ignores: ['node_modules', 'dist'] },
  ...baseConfig,
  ...typescriptConfig,
  ...importConfig,
  ...jsdocConfig,
  ...vitestConfig,
  ...formattingConfig,
];
```
