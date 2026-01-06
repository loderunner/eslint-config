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
  // ... your configs
  baseRules,
];
```

**Full config usage:**

```javascript
import baseConfig from 'eslint-config-loderunner/base';

export default [
  // ... your configs
  ...baseConfig,
];
```

### typescript

TypeScript rules with type-checking enabled. Includes strict boolean
expressions, exhaustive switch checks, and consistent type imports.

**Peer dependencies:** `typescript-eslint`

**Rules-only usage:**

```javascript
import typescriptRules from 'eslint-config-loderunner/typescript/rules';

export default [
  // ... your configs
  typescriptRules,
];
```

**Full config usage:**

```javascript
import typescriptConfig from 'eslint-config-loderunner/typescript';

export default [
  // ... your configs
  ...typescriptConfig,
];
```

### react

React and React Hooks rules. Includes JSX prop sorting (reserved props first,
callbacks last).

**Peer dependencies:** `eslint-plugin-react`, `eslint-plugin-react-hooks`

**Rules-only usage:**

```javascript
import reactRules from 'eslint-config-loderunner/react/rules';

export default [
  // ... your configs
  reactRules,
];
```

**Full config usage:**

```javascript
import reactConfig from 'eslint-config-loderunner/react';

export default [
  // ... your configs
  ...reactConfig,
];
```

### Vue

Vue.js rules.

**Peer dependencies:** `eslint-plugin-vue`

**Rules-only usage:**

```javascript
import vueRules from 'eslint-config-loderunner/vue/rules';

export default [
  // ... your configs
  vueRules,
];
```

**Full config usage:**

```javascript
import vueConfig from 'eslint-config-loderunner/vue';

export default [
  // ... your configs
  ...vueConfig,
];
```

### import

Import ordering and organization rules. Enforces alphabetical sorting with
newlines between groups.

**Peer dependencies:** `eslint-plugin-import`

**Rules-only usage:**

```javascript
import importRules from 'eslint-config-loderunner/import/rules';

export default [
  // ... your configs
  importRules,
];
```

**Full config usage:**

```javascript
import importConfig from 'eslint-config-loderunner/import';

export default [
  // ... your configs
  ...importConfig,
];
```

### jsdoc

JSDoc documentation rules. Requires JSDoc for public exports, enforces
consistent formatting, and disallows types in JSDoc (prefer TypeScript).

**Peer dependencies:** `eslint-plugin-jsdoc`

**Rules-only usage:**

```javascript
import jsdocRules from 'eslint-config-loderunner/jsdoc/rules';

export default [
  // ... your configs
  jsdocRules,
];
```

**Full config usage:**

```javascript
import jsdocConfig from 'eslint-config-loderunner/jsdoc';

export default [
  // ... your configs
  ...jsdocConfig,
];
```

### vitest

Vitest-specific rules for test files. Relaxes strict TypeScript rules for test
flexibility (allows `any`, unbound methods, etc.).

**Peer dependencies:** `@vitest/eslint-plugin`

**Rules-only usage:**

```javascript
import vitestRules from 'eslint-config-loderunner/vitest/rules';

export default [
  // ... your configs
  {
    files: ['**/*.test.{ts,tsx}'],
    ...vitestRules,
  },
];
```

**Full config usage:**

```javascript
import vitestConfig from 'eslint-config-loderunner/vitest';

export default [
  // ... your configs
  ...vitestConfig,
];
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
  // ... your configs
  formattingRules, // Must be last
];
```

**Full config usage:**

```javascript
import formattingConfig from 'eslint-config-loderunner/formatting';

export default [
  // ... your configs
  ...formattingConfig, // Must be last
];
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
  { ignores: ['node_modules', 'dist'] },
  ...baseConfig,
  ...typescriptConfig,
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
  { ignores: ['node_modules', 'dist'] },
  ...baseConfig,
  ...typescriptConfig,
  ...importConfig,
  ...jsdocConfig,
  ...vitestConfig,
  ...formattingConfig,
];
```
