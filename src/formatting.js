/**
 * Formatting rules that should be applied LAST in your config array,
 * after any formatter configs (e.g., eslint-config-prettier).
 *
 * This re-enables formatting rules that prettifier configs typically disable.
 *
 * @type {import('eslint').Linter.Config}
 */
export const formatting = {
  rules: {
    curly: ['error', 'all'],
  },
};
