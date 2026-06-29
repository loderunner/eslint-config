/**
 * @type {import('eslint').Rule.RuleModule}
 */
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
      useBlockReturn:
        'Wrap the implicit return in a block body with an explicit `return` statement.',
    },
    hasSuggestions: true,
    schema: [],
  },
  create(context) {
    return {
      ArrowFunctionExpression(node) {
        if (node.expression && node.body.type === 'ArrowFunctionExpression') {
          context.report({
            node: node.body,
            messageId: 'noChainedArrow',
            suggest: [
              {
                messageId: 'useBlockReturn',
                fix: function (fixer) {
                  return fixer.replaceText(
                    node.body,
                    `{ return ${context.sourceCode.getText(node.body)}; }`,
                  );
                },
              },
            ],
          });
        }
      },
    };
  },
};
