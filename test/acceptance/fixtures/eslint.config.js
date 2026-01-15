import { defineConfig } from 'eslint/config';
import baseConfig from 'eslint-config-loderunner/base';
import formattingConfig from 'eslint-config-loderunner/formatting';
import importConfig from 'eslint-config-loderunner/import';
import jsdocConfig from 'eslint-config-loderunner/jsdoc';
import reactConfig from 'eslint-config-loderunner/react';
import typescriptConfig from 'eslint-config-loderunner/typescript';
import vitestConfig from 'eslint-config-loderunner/vitest';
import vueConfig from 'eslint-config-loderunner/vue';

export default defineConfig([
  { ignores: ['node_modules'] },
  { extends: [baseConfig] },
  { files: ['**/*.{ts,tsx}'], extends: [typescriptConfig] },
  { extends: [importConfig] },
  { files: ['**/*.tsx'], extends: [reactConfig] },
  { files: ['**/*.vue'], extends: [vueConfig] },
  { files: ['**/*.test.{js,ts,tsx}'], extends: [vitestConfig] },
  { files: ['**/*.{ts,tsx}'], extends: [jsdocConfig] },
  { extends: [formattingConfig] },
]);
