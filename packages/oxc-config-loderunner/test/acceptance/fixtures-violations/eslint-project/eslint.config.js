import { defineConfig } from 'eslint/config';
import baseConfig from 'eslint-config-loderunner/base';
import formattingConfig from 'eslint-config-loderunner/formatting';
import reactConfig from 'eslint-config-loderunner/react';
import typescriptConfig from 'eslint-config-loderunner/typescript';
import vitestConfig from 'eslint-config-loderunner/vitest';

// Parity fixture (Part 9 item 8 of the plan): only the presets that have an
// oxc-config-loderunner counterpart are composed here (base, typescript,
// react, vitest, plus formatting - which the plan says "collapses into
// base" on the oxc side, contributing just `eslint/curly` there) -
// import/jsdoc/vue/tailwindcss are deliberately dropped on the oxc side
// (plan Part 5) and are out of scope for this comparison.
export default defineConfig([
  { ignores: ['node_modules'] },
  { extends: [baseConfig] },
  { files: ['**/*.{ts,tsx}'], extends: [typescriptConfig] },
  { files: ['**/*.tsx'], extends: [reactConfig] },
  { files: ['**/*.test.{js,ts,tsx}'], extends: [vitestConfig] },
  { extends: [formattingConfig] },
]);
