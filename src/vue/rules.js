/**
 * Vue-specific ESLint rules.
 *
 * Rules changed:
 * - `vue/multi-word-component-names`: Disabled for flexibility
 *
 * @type {import('eslint').Linter.Config}
 */
const vueRules = {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  };

export default vueRules;
