# loderunner/no-chained-arrow

Disallow arrow functions whose expression body is itself an arrow function.

## Rule Details

Chained arrow functions — where an arrow function's expression body is another
arrow function — can be hard to read. `() => () =>` looks like an alien syntax.
This rule flags that pattern and asks for a block body with an explicit `return`
instead.

### Options

This rule has no options.

## Examples

### Invalid

```js
export const createStringifier = (value) => () => value.toString();

useEffect(() => () => cleanup(), [cleanup]);

subscribe((topic) => (payload) => publish(topic, payload));
```

### Valid

```js
function createStringifier(value) {
  return () => value.toString();
}

const createStringifier = (value) => {
  return () => value.toString();
};

useEffect(() => {
  return () => cleanup();
}, [cleanup]);

subscribe((topic) => {
  return (payload) => publish(topic, payload);
});
```
