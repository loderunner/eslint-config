import { expect, it } from 'vitest';

async function doSomethingAsync(): Promise<void> {
  throw new Error('boom');
}

it('wraps an awaited call unnecessarily', async () => {
  await expect(async () => {
    await doSomethingAsync();
  }).rejects.toThrow();
});
