import { base, typescript, react, vitest } from 'oxc-config-loderunner/oxlint';
import { defineConfig } from 'oxlint';

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
