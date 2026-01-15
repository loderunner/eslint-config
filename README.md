# eslint-config-loderunner

Reusable ESLint flat configs for TypeScript, React, Vitest, and more.

This package provides modular ESLint configurations that you can mix and match.
Each config is available in two forms: **full configs** (includes plugins and
recommended rules) and **rules-only** exports (just the custom rules, for mixing
with your own setup).

Each config module is independent and has its own peer dependencies that you
must install separately. This keeps your project lean—you only install the
plugins you actually use. Check the **Peer dependencies** section for each
config below and install the required packages.

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

**Peer dependencies:**

```bash
pnpm add --save-dev @eslint/js
```

**Rules-only usage:**

```javascript
import { defineConfig } from 'eslint/config';

import baseRules from 'eslint-config-loderunner/base/rules';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    rules: {
      ...baseRules,
    },
  },
]);
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

**Peer dependencies:**

```bash
pnpm add --save-dev typescript-eslint
```

**Rules-only usage:**

```javascript
import { defineConfig } from 'eslint/config';

import typescriptRules from 'eslint-config-loderunner/typescript/rules';

export default defineConfig([
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      ...typescriptRules,
    },
  },
]);
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

**Peer dependencies:**

```bash
pnpm add --save-dev eslint-plugin-react eslint-plugin-react-hooks
```

**Rules-only usage:**

```javascript
import { defineConfig } from 'eslint/config';

import reactRules from 'eslint-config-loderunner/react/rules';

export default defineConfig([
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      ...reactRules,
    },
  },
]);
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

**Peer dependencies:**

```bash
pnpm add --save-dev eslint-plugin-vue
```

**Rules-only usage:**

```javascript
import { defineConfig } from 'eslint/config';

import vueRules from 'eslint-config-loderunner/vue/rules';

export default defineConfig([
  {
    files: ['**/*.vue'],
    rules: {
      ...vueRules,
    },
  },
]);
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

**Peer dependencies:**

```bash
pnpm add --save-dev eslint-plugin-import
```

**Rules-only usage:**

```javascript
import { defineConfig } from 'eslint/config';

import importRules from 'eslint-config-loderunner/import/rules';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    rules: {
      ...importRules,
    },
  },
]);
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

**Peer dependencies:**

```bash
pnpm add --save-dev eslint-plugin-jsdoc
```

**Rules-only usage:**

```javascript
import { defineConfig } from 'eslint/config';

import jsdocRules from 'eslint-config-loderunner/jsdoc/rules';

export default defineConfig([
  {
    files: ['**/*.{js,ts}'],
    rules: {
      ...jsdocRules,
    },
  },
]);
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

**Peer dependencies:**

```bash
pnpm add --save-dev @vitest/eslint-plugin
```

**Rules-only usage:**

```javascript
import { defineConfig } from 'eslint/config';

import vitestRules from 'eslint-config-loderunner/vitest/rules';

export default defineConfig([
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      ...vitestRules,
    },
  },
]);
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

**Peer dependencies:**

```bash
pnpm add --save-dev eslint-config-prettier
```

**Rules-only usage:**

```javascript
import { defineConfig } from 'eslint/config';

import formattingRules from 'eslint-config-loderunner/formatting/rules';

export default defineConfig([
  // ... your other configs first
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    rules: {
      ...formattingRules, // Must be last
    },
  },
]);
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
import { defineConfig } from 'eslint/config';

import baseConfig from 'eslint-config-loderunner/base';
import formattingConfig from 'eslint-config-loderunner/formatting';
import importConfig from 'eslint-config-loderunner/import';
import reactConfig from 'eslint-config-loderunner/react';
import typescriptConfig from 'eslint-config-loderunner/typescript';

export default defineConfig([
  { files: ['src/**/*.{js,jsx,ts,tsx}'] },
  { ignores: ['dist', 'node_modules'] },
  { extends: [baseConfig] },
  { extends: [typescriptConfig] },
  { extends: [reactConfig] },
  { extends: [importConfig] },
  { extends: [formattingConfig] },
]);
```

### Node.js Backend/CLI

```javascript
import { defineConfig } from 'eslint/config';

import baseConfig from 'eslint-config-loderunner/base';
import formattingConfig from 'eslint-config-loderunner/formatting';
import importConfig from 'eslint-config-loderunner/import';
import typescriptConfig from 'eslint-config-loderunner/typescript';

export default defineConfig([
  { files: ['src/**/*.{js,ts}'] },
  { ignores: ['node_modules', 'dist'] },
  { extends: [baseConfig] },
  { extends: [typescriptConfig] },
  { extends: [importConfig] },
  { extends: [formattingConfig] },
]);
```

### Vue.js

```javascript
import { defineConfig } from 'eslint/config';
import globals from 'globals';

import baseConfig from 'eslint-config-loderunner/base';
import formattingConfig from 'eslint-config-loderunner/formatting';
import importConfig from 'eslint-config-loderunner/import';
import typescriptConfig from 'eslint-config-loderunner/typescript';
import vueConfig from 'eslint-config-loderunner/vue';

export default defineConfig([
  {
    files: ['src/**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  { ignores: ['dist', 'node_modules'] },
  { extends: [baseConfig] },
  { extends: [typescriptConfig] },
  { extends: [vueConfig] },
  { extends: [importConfig] },
  { extends: [formattingConfig] },
]);
```

### Library

```javascript
import { defineConfig } from 'eslint/config';

import baseConfig from 'eslint-config-loderunner/base';
import formattingConfig from 'eslint-config-loderunner/formatting';
import importConfig from 'eslint-config-loderunner/import';
import jsdocConfig from 'eslint-config-loderunner/jsdoc';
import typescriptConfig from 'eslint-config-loderunner/typescript';
import vitestConfig from 'eslint-config-loderunner/vitest';

export default defineConfig([
  { files: ['src/**/*.{js,ts}'] },
  { ignores: ['node_modules', 'dist'] },
  { extends: [baseConfig] },
  { extends: [typescriptConfig] },
  { extends: [importConfig] },
  { extends: [jsdocConfig] },
  { extends: [vitestConfig] },
  { extends: [formattingConfig] },
]);
```
