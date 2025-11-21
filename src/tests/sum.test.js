import { sum } from '../utils/sum.js';

test('suma dos números en el frontend', () => {
  expect(sum(2, 3)).toBe(5);
});