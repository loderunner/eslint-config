import pluginVue from "eslint-plugin-vue";
import vueRules from './rules.js';

/**
 * Vue ESLint config with recommended rules and custom rules.
 * Includes vue-eslint flat/essential and flat/recommended config and parser options.
 *
 * @type {import('eslint').Linter.Config[]}
 */

const vueConfig = [
  ...pluginVue.configs["flat/recommended"],
  {
    rules: {
      ...vueRules.rules,
    },
  },
];

export default vueConfig;
