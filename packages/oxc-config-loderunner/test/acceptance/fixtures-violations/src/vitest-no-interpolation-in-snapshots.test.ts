import { expect, it } from 'vitest';

it('interpolates into an inline snapshot', () => {
  const value = 'dynamic';
  expect({ value }).toMatchInlineSnapshot(`{ value: ${value} }`);
});
