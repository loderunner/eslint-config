import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import vueRules from './rules.js';

/**
 * Vue ESLint config with recommended rules and custom rules.
 * Includes vue-eslint flat/essential and flat/recommended config and parser options.
 *
 * @type {import('eslint').Linter.Config[]}
 */

const vueConfig = [
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    name: "app/files-to-ignore",
    ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**", "**/assets/**"],
  },
  ...pluginVue.configs["flat/essential"],
  ...pluginVue.configs["flat/recommended"],
  {
    rules: {
      ...vueRules.rules,
    },
  },
];

export default vueConfig;
