import { describe, expect, it } from 'vitest';

describe('identical titles', () => {
  it('does the thing', () => {
    expect(true).toBe(true);
  });

  it('does the thing', () => {
    expect(true).toBe(true);
  });
});
