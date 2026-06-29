import rule from '../../src/rules/no-chained-arrow.js';

import ruleTester from './rule-tester.js';

ruleTester.run('no-chained-arrow', rule, {
  valid: [
    'const increment = (value) => value + 1;',
    'function createStringifier(value) { return () => value.toString(); }',
    'const createStringifier = (value) => { return () => value.toString(); };',
    'useEffect(() => { return () => cleanup(); }, [cleanup]);',
    'const handlers = items.map((item) => item.id);',
    'const factory = (size) => Array.from({ length: size }, (_, index) => index);',
  ],
  invalid: [
    {
      code: 'export const createStringifier = (value) => () => value.toString();',
      errors: [{ messageId: 'noChainedArrow' }],
    },
    {
      code: 'export const createStringifierCreator = (value) => { return () => () => value.toString(); }',
      errors: [{ messageId: 'noChainedArrow' }],
    },
    {
      code: 'useEffect(() => () => cleanup(), [cleanup]);',
      errors: [{ messageId: 'noChainedArrow' }],
    },
    {
      code: 'subscribe((topic) => (payload) => publish(topic, payload));',
      errors: [{ messageId: 'noChainedArrow' }],
    },
    {
      code: 'const delayed = (ms) => async () => new Promise((resolve) => setTimeout(resolve, ms));',
      errors: [{ messageId: 'noChainedArrow' }],
    },
  ],
});
