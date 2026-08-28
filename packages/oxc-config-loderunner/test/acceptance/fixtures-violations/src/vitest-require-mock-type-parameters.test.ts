import { expect, it, vi } from 'vitest';

it('mocks without type parameters', () => {
  const fn = vi.fn();
  expect(fn).toBeDefined();
});
