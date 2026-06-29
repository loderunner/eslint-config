export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow arrow functions whose expression body is itself an arrow function',
    },
    messages: {
      noChainedArrow:
        'Arrow function should not use an expression body that is another arrow function. ' +
        'Use a block body with an explicit return instead.',
    },
    schema: [],
  },
  create(context) {
    return {
      ArrowFunctionExpression(node) {
        if (node.expression && node.body.type === 'ArrowFunctionExpression') {
          context.report({ node: node.body, messageId: 'noChainedArrow' });
        }
      },
    };
  },
};
