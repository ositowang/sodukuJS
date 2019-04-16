import { checkArray as check, checker } from '../core/check';
import { generateSoduku } from '../core/sodukuGenerator';

test('checkArray checks input array', () => {
  expect(check([1, 2, 3, 4, 5, 6, 7, 8, 0])[8]).toBe(false);
  expect(check([1, 2, 3, 2, 4, 5, 6, 7, 8])[1]).toBe(false);
  expect(check([1, 2, 3, 4, 5, 6, 7, 8, 9]).every((mark) => mark)).toBe(true);
});

test('valid soduku pass checker', () => {
  const testSoduku = generateSoduku().generate();
  const checkInstance = checker(testSoduku);
  const result = checkInstance.check();
  expect(result).toBe(true);
});

test('invalid soduku failed the checker', () => {
  const testSoduku = generateSoduku().generate();
  testSoduku[1][1] = 0;
  testSoduku[8][8] = 0;
  const checkInstance = checker(testSoduku);
  const result = checkInstance.check();
  console.log(checkInstance.matrixMarks);
  expect(result).toBe(false);
});
