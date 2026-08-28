import { expect, it, vi } from 'vitest';

it('checks call count and args separately', () => {
  const fn = vi.fn();
  fn('a');
  expect(fn).toHaveBeenCalledOnce();
  expect(fn).toHaveBeenCalledWith('a');
});
