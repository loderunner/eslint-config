import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';

import tailwindcssRules from './rules.js';

/**
 * Tailwind CSS ESLint config with recommended rules and custom rules.
 * Includes eslint-plugin-better-tailwindcss's recommended config.
 *
 * @type {import('eslint').Linter.Config[]}
 */
const tailwindcssConfig = [
  eslintPluginBetterTailwindcss.configs.recommended,
  { rules: tailwindcssRules },
];

export default tailwindcssConfig;
