import noChainedArrow from './rules/no-chained-arrow.js';

/**
 * @type {import('eslint').ESLint.Plugin}
 */
const plugin = {
  meta: { name: 'loderunner' },
  rules: {
    'no-chained-arrow': noChainedArrow,
  },
};

export default plugin;
