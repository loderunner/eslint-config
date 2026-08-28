import mockData from '../__mocks__/data';
import { expect, it } from 'vitest';

it('uses mock data', () => {
  expect(mockData).toBeDefined();
});
