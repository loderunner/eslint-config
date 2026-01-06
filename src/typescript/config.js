import tseslint from 'typescript-eslint';

import typescriptRules from './rules';

/**
 * TypeScript ESLint config with recommended type-checked rules and custom rules.
 * Includes typescript-eslint recommendedTypeChecked config and parser options.
 *
 * @type {import('eslint').Linter.Config[]}
 */
const typescriptConfig = [
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.{config,setup}.{js,mjs,cjs,ts}'],
        },
      },
    },
  },
  typescriptRules,
];

export default typescriptConfig;
