# oxc-config-loderunner

Reusable oxlint and oxfmt configs for TypeScript, React, Vitest, and more.

Using ESLint instead? →
[`eslint-config-loderunner`](../eslint-config-loderunner/README.md)

This package ships four oxlint presets (`base`, `typescript`, `react`, `vitest`)
and one oxfmt preset, derived from the same rule intent as
`eslint-config-loderunner` wherever oxlint has a matching rule (see
[`shared/rule-map.js`](../../shared/rule-map.js) in this repo for the exact
mapping). Presets are plain config objects composed with oxlint's own `extends`
— there is no merge helper, mirroring the composability of the ESLint side.

- [Installation](#installation)
- [`oxlint.config.ts`](#oxlintconfigts)
- [Presets](#presets)
  - [base](#base)
  - [typescript](#typescript)
  - [react](#react)
  - [vitest](#vitest)
- [`oxfmt.config.ts`](#oxfmtconfigts)
- [Using `.oxlintrc.json` / `.oxfmtrc.json`](#using-oxlintrcjson--oxfmtrcjson)
- [Migrating from `eslint-config-loderunner`](#migrating-from-eslint-config-loderunner)
- [Rules oxlint's defaults add that ESLint didn't enforce](#rules-oxlints-defaults-add-that-eslint-didnt-enforce)
- [Recovering a dropped preset with an aliased JS plugin](#recovering-a-dropped-preset-with-an-aliased-js-plugin)

## Installation

```bash
pnpm add --save-dev oxc-config-loderunner oxlint oxlint-tsgolint oxfmt eslint-plugin-loderunner
```

`oxlint` is a required peer. `oxlint-tsgolint` (type-aware linting) and `oxfmt`
are optional peers — install them if you use those features.
`eslint-plugin-loderunner` ships the one custom rule
(`loderunner/no-chained-arrow`) and is referenced through oxlint's `jsPlugins`
mechanism, not through this package.

> **oxfmt is pre-1.0** (`0.65.0` as of writing). Its config surface — in
> particular `sortImports`, `sortTailwindcss` and the `jsdoc` formatting option
> — can change in a minor release. Pin an exact version if that matters to you.

## `oxlint.config.ts`

The primary, supported way to consume this package. `extends` in
`oxlint.config.ts` accepts imported config **objects**, unlike `.oxlintrc.json`,
which only accepts relative file paths and cannot reach into `node_modules`
([nested configs](https://oxc.rs/docs/guide/usage/linter/nested-config)).
`oxlint.config.ts` requires the Node-based `oxlint` npm package and Node v22.18+
or v24+.

```ts
import { defineConfig } from 'oxlint';
import { base, typescript, react, vitest } from 'oxc-config-loderunner/oxlint';

export default defineConfig({
  extends: [base, typescript, react, vitest],

  // `extends` only merges `rules`, `plugins` and `overrides` — these four
  // fields do not propagate through it and must be set here instead. See
  // https://oxc.rs/docs/guide/usage/linter/nested-config for why.
  categories: { correctness: 'error' },
  options: { typeAware: true },
  jsPlugins: ['eslint-plugin-loderunner'],
  ignorePatterns: ['.next/', 'coverage/'],
});
```

- **`categories: { correctness: 'error' }`** is what turns on oxlint's built-in
  correctness rules; it is not carried by any preset.
- **`options.typeAware: true`** enables the type-aware `typescript/*` rules
  (requires `oxlint-tsgolint`). This is deliberately root-config-only in oxlint
  and cannot be baked into a shared preset.
- **`jsPlugins: ['eslint-plugin-loderunner']`** registers the custom
  `loderunner/no-chained-arrow` rule that `base` references. oxlint resolves
  `jsPlugins` entries as any valid import specifier, including bare package
  names.
- **`ignorePatterns`** is inherently per-repo.

## Presets

### base

Core JavaScript rules: strict equality, no `var`, no duplicate imports, `curly`,
and `loderunner/no-chained-arrow` — plus the members of `eslint:recommended`
that oxlint categorizes outside `correctness` (and so would otherwise not fire):
`no-array-constructor`, `no-case-declarations`, `no-fallthrough`,
`no-prototype-builtins`, `no-empty`, `no-regex-spaces`.

Declares no `plugins` — the default plugin set (`eslint`, `typescript`,
`unicorn`, `oxc`) already covers it.

```ts
import { defineConfig } from 'oxlint';
import { base } from 'oxc-config-loderunner/oxlint';

export default defineConfig({
  extends: [base],
  categories: { correctness: 'error' },
  jsPlugins: ['eslint-plugin-loderunner'],
});
```

### typescript

Type-aware TypeScript rules: exhaustive switches, strict boolean expressions
(all eight `allow*` options pinned `false` — oxlint's own defaults are more
permissive), nullish-coalescing preference, detection of misused promises,
consistent type imports, and deprecation warnings — plus the `typescript-eslint`
`recommendedTypeChecked` members that oxlint categorizes outside `correctness`,
which must be restated explicitly (`no-explicit-any`, the `no-unsafe-*` family,
`ban-ts-comment`, `no-empty-object-type`, `no-namespace`, `no-require-imports`,
`no-unnecessary-type-assertion`, `no-unsafe-enum-comparison`,
`no-unnecessary-type-constraint`, and others). Also restates the
`@typescript-eslint/eslint-recommended` base-rule adjustments (disabling rules
TypeScript's compiler already checks, re-enabling three ES2015+ style rules)
scoped to `**/*.ts`, `**/*.tsx`, `**/*.mts`, `**/*.cts`.

Requires `options.typeAware: true` at the root of your config (see
[`oxlint.config.ts`](#oxlintconfigts) above) and the `oxlint-tsgolint` peer.
Declares no `plugins` — `typescript` is already in the default set.

```ts
import { defineConfig } from 'oxlint';
import { base, typescript } from 'oxc-config-loderunner/oxlint';

export default defineConfig({
  extends: [base, typescript],
  categories: { correctness: 'error' },
  options: { typeAware: true },
  jsPlugins: ['eslint-plugin-loderunner'],
});
```

### react

React, React Hooks, and React Compiler rules, bundled together in oxlint's
`react` plugin. Restates `eslint-plugin-react` / `eslint-plugin-react-hooks`
recommended severities that oxlint's `correctness` category alone doesn't cover,
and demotes `react/exhaustive-deps` and the five React Compiler correctness
rules (`purity`, `immutability`, `set-state-in-render`,
`preserve-manual-memoization`, `incompatible-library`, all on by default at
`error` since oxlint v1.79.0) to `warn` for a gentler adoption path.

Declares `plugins: ['react']` — unlike `eslint`/`typescript`, `react` is not in
oxlint's default plugin set.

```ts
import { defineConfig } from 'oxlint';
import { base, react } from 'oxc-config-loderunner/oxlint';

export default defineConfig({
  extends: [base, react],
  categories: { correctness: 'error' },
  jsPlugins: ['eslint-plugin-loderunner'],
});
```

### vitest

Vitest-specific rules, scoped to `**/*.test.*` via an `overrides` entry (unlike
the migration-reference config this package supersedes, which applied vitest
rules globally). Restates the native `vitest` plugin's recommended severities
for the rules oxlint categorizes outside `correctness`, and disables the four
type-aware TypeScript rules that are overly strict in test files
(`no-explicit-any`, `unbound-method`, `no-unsafe-assignment`,
`no-unsafe-member-access`) — all four are `correctness` (on by default), so this
is a real relaxation, not a no-op.

```ts
import { defineConfig } from 'oxlint';
import { base, typescript, react, vitest } from 'oxc-config-loderunner/oxlint';

export default defineConfig({
  extends: [base, typescript, react, vitest],
  categories: { correctness: 'error' },
  options: { typeAware: true },
  jsPlugins: ['eslint-plugin-loderunner'],
});
```

## `oxfmt.config.ts`

```ts
import { defineConfig } from 'oxfmt';
import oxfmtConfig from 'oxc-config-loderunner/oxfmt';

export default defineConfig({ ...oxfmtConfig });
```

Sets `printWidth: 80` (oxfmt defaults to 100), `singleQuote: true`,
`sortPackageJson: false` (oxfmt defaults to `true`, which is not
Prettier-compatible — a shared config must not silently reorder `package.json`),
`sortImports: { ignoreCase: false }` (replaces `import-x/order`; named-specifier
sorting has no oxfmt equivalent and is dropped — see the migration table below),
and `proseWrap: 'always'` for Markdown files. Every other option is left at
oxfmt's default.

For Tailwind CSS class sorting (the same algorithm as
`prettier-plugin-tailwindcss`), use `withTailwind`:

```ts
import { defineConfig } from 'oxfmt';
import { withTailwind } from 'oxc-config-loderunner/oxfmt';

export default defineConfig(withTailwind({ stylesheet: './src/app.css' }));
```

## Using `.oxlintrc.json` / `.oxfmtrc.json`

<details>
<summary>Standalone <code>oxlint</code>/<code>oxfmt</code> binary, or Node
&lt; 22.18</summary>

`.oxlintrc.json`'s `extends` only accepts relative file paths, never package
imports, so it reaches into `node_modules` directly:

```jsonc
{
  "extends": [
    "./node_modules/oxc-config-loderunner/oxlint/base.json",
    "./node_modules/oxc-config-loderunner/oxlint/typescript.json",
    "./node_modules/oxc-config-loderunner/oxlint/react.json",
    "./node_modules/oxc-config-loderunner/oxlint/vitest.json",
  ],
  // The same four fields `extends` doesn't carry, restated here instead of
  // in oxlint.config.ts:
  "categories": { "correctness": "error" },
  "options": { "typeAware": true },
  "jsPlugins": ["eslint-plugin-loderunner"],
  "settings": { "react": { "version": "19.0.0" } },
  "ignorePatterns": [".next/", "coverage/"],
}
```

`.oxfmtrc.json` has **no `extends` field at all** — oxfmt's maintainers
deliberately never added one (see
[oxc#16394](https://github.com/oxc-project/oxc/issues/16394)). Copy the contents
of [`oxfmt.json`](https://unpkg.com/browse/oxc-config-loderunner/oxfmt.json)
verbatim:

```jsonc
{
  "printWidth": 80,
  "singleQuote": true,
  "sortPackageJson": false,
  "sortImports": { "ignoreCase": false },
  "overrides": [{ "files": ["**/*.md"], "options": { "proseWrap": "always" } }],
}
```

</details>

## Migrating from `eslint-config-loderunner`

| ESLint preset / rule                    | oxc equivalent                             | Notes                                                                                                                                                                                                  |
| --------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `base`, `typescript`, `react`, `vitest` | `base`, `typescript`, `react`, `vitest`    | Rule-for-rule, see [Presets](#presets) above                                                                                                                                                           |
| `formatting`                            | collapses into `base`                      | Just `eslint/curly` — `eslint-config-prettier` needs no counterpart, since oxlint's `style` category is off by default                                                                                 |
| `import`'s `import-x/order`             | oxfmt `sortImports: { ignoreCase: false }` | Statement-level sorting only; `import-x/order`'s `named: true` (sorting specifiers inside `{ }`) has no oxfmt equivalent ([oxc#20160](https://github.com/oxc-project/oxc/issues/20160)) and is dropped |
| `import`'s `import-x/no-deprecated`     | _dropped_                                  | No oxlint equivalent (404); partially covered by type-aware `typescript/no-deprecated` for TS files only                                                                                               |
| `jsdoc` (all six rules)                 | _dropped_                                  | All 404 in oxlint. oxlint's native `jsdoc` plugin is a different, smaller rule set; oxfmt's `jsdoc` formatting option covers layout only, not `require-jsdoc`/`no-types`/`require-description`         |
| `vue`                                   | _dropped_                                  | oxlint does no template linting for Vue at all — `eslint-plugin-vue`'s `flat/recommended` is largely template rules, so there is no honest port                                                        |
| `tailwindcss`                           | _dropped, partially_                       | `enforce-consistent-class-order` → oxfmt `sortTailwindcss` (see `withTailwind` above); variant order, variable syntax and line wrapping have no oxc counterpart                                        |
| `react/jsx-sort-props`                  | _dropped_                                  | No oxlint equivalent (404)                                                                                                                                                                             |
| `react/prop-types: "off"`               | _dropped_                                  | The rule doesn't exist in oxlint — restating `"off"` would be a no-op implying coverage that isn't there                                                                                               |

No Next.js preset is shipped, matching the ESLint side (which never shipped one
either) — pull in oxlint's native `nextjs`, `react` and `jsx-a11y` plugins
yourself; `next/core-web-vitals` maps roughly to
`plugins: ['nextjs', 'react', 'jsx-a11y']`.

## Rules oxlint's defaults add that ESLint didn't enforce

These are the main source of new findings when you first adopt this package:

- **`unicorn` and `oxc` plugins are in oxlint's default plugin set.** Their
  `correctness` rules fire even though `eslint-plugin-unicorn` was never part of
  `eslint-config-loderunner`. They are kept (dropping them would mean declaring
  `plugins: []` and re-listing everything by hand), but it's worth knowing where
  new findings come from.
- **The five React Compiler `correctness` rules** (`react/purity`,
  `react/immutability`, `react/set-state-in-render`,
  `react/preserve-manual-memoization`, `react/incompatible-library`, added in
  oxlint v1.79.0) are demoted to `warn` in the `react` preset, but are still new
  findings not present under the ESLint config at all.
- **`react/exhaustive-deps`** is `correctness` in oxlint (on by default at
  `error`), unlike `eslint-plugin-react-hooks`'s recommended `warn`. Demoted to
  `warn` in the `react` preset for parity.
- **`vitest/require-mock-type-parameters`** is `correctness` in oxlint, so it
  fires on test files for free — unlike the migration-reference
  `.oxlintrc.json`, which turned it off, this preset leaves it on since there is
  no ESLint-side equivalent forcing it off and it is a genuinely useful check.
  Expect it as a new finding if your mocks don't already pass type parameters.

## Recovering a dropped preset with an aliased JS plugin

<details>
<summary>Running an ESLint plugin under oxlint via an aliased
<code>jsPlugins</code> entry</summary>

oxlint's JS plugin API is ESLint v9+-compatible enough that you can run some
ESLint plugins directly, aliased so their rule ids don't collide with a built-in
plugin name:

```jsonc
{
  "jsPlugins": [{ "name": "jsdoc-js", "specifier": "eslint-plugin-jsdoc" }],
  "rules": {
    "jsdoc-js/check-alignment": "warn",
  },
}
```

This can recover `import-x/no-deprecated`, the whole `jsdoc` preset, and
`react/jsx-sort-props` — at the cost of adding back the JS dependency tree this
package's design deliberately avoids, and running on oxlint's alpha-status
JS-plugin runtime.

It **cannot** recover `vue` or `tailwindcss`: JS plugins do not support custom
parsers, and both `eslint-plugin-vue` and `eslint-plugin-better-tailwindcss`
need one.

</details>
