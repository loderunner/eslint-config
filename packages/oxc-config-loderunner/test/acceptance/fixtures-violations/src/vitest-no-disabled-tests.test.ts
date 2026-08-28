import { describe, expect, it } from 'vitest';

describe('disabled tests', () => {
  it.skip('is skipped', () => {
    expect(true).toBe(true);
  });
});
