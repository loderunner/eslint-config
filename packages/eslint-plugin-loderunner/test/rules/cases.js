export const valid = [
  'const increment = (value) => value + 1;',
  'function createStringifier(value) { return () => value.toString(); }',
  'const createStringifier = (value) => { return () => value.toString(); };',
  'useEffect(() => { return () => cleanup(); }, [cleanup]);',
  'const handlers = items.map((item) => item.id);',
  'const factory = (size) => Array.from({ length: size }, (_, index) => index);',
];

export const invalid = [
  {
    code: 'export const createStringifier = (value) => () => value.toString();',
    errors: [
      {
        messageId: 'noChainedArrow',
        suggestions: [
          {
            messageId: 'useBlockReturn',
            output:
              'export const createStringifier = (value) => { return () => value.toString(); };',
          },
        ],
      },
    ],
  },
  {
    code: 'export const createStringifierCreator = (value) => { return () => () => value.toString(); }',
    errors: [
      {
        messageId: 'noChainedArrow',
        suggestions: [
          {
            messageId: 'useBlockReturn',
            output:
              'export const createStringifierCreator = (value) => { return () => { return () => value.toString(); }; }',
          },
        ],
      },
    ],
  },
  {
    code: 'useEffect(() => () => cleanup(), [cleanup]);',
    errors: [
      {
        messageId: 'noChainedArrow',
        suggestions: [
          {
            messageId: 'useBlockReturn',
            output: 'useEffect(() => { return () => cleanup(); }, [cleanup]);',
          },
        ],
      },
    ],
  },
  {
    code: 'subscribe((topic) => (payload) => publish(topic, payload));',
    errors: [
      {
        messageId: 'noChainedArrow',
        suggestions: [
          {
            messageId: 'useBlockReturn',
            output:
              'subscribe((topic) => { return (payload) => publish(topic, payload); });',
          },
        ],
      },
    ],
  },
  {
    code: 'const delayed = (ms) => async () => new Promise((resolve) => setTimeout(resolve, ms));',
    errors: [
      {
        messageId: 'noChainedArrow',
        suggestions: [
          {
            messageId: 'useBlockReturn',
            output:
              'const delayed = (ms) => { return async () => new Promise((resolve) => setTimeout(resolve, ms)); };',
          },
        ],
      },
    ],
  },
];
