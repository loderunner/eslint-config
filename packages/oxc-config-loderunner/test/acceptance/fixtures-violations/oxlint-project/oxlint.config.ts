import { base, typescript, react, vitest } from 'oxc-config-loderunner/oxlint';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [base, typescript, react, vitest],
  categories: { correctness: 'error' },
  options: { typeAware: true },
  jsPlugins: ['eslint-plugin-loderunner'],
});
