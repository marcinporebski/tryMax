import {
  expBackoff,
  second,
  oneSecond,
  twoSeconds,
  fiveSeconds,
} from '../src/consts';
import { tryMax } from '../src/tryMax';

describe('expBackoff', () => {
  it('should return correct values for 1-6 retries', () => {
    const cases = [
      [1, 1 * second],
      [2, 2 * second],
      [3, 4 * second],
      [4, 8 * second],
      [5, 16 * second],
      [6, 32 * second],
    ];

    cases.forEach(([input, expectation]) => {
      const result = expBackoff(input);
      expect(result).toEqual(expectation);
    });
  });
});

describe('timeDelay', () => {
  it('should return correct values for X seconds', () => {
    expect(second).toEqual(1000);
    expect(oneSecond(0)).toEqual(1000);
    expect(twoSeconds(0)).toEqual(2000);
    expect(fiveSeconds(0)).toEqual(5000);
  });
});

describe('tryMax', () => {
  it('should return scalar value if non-Promise value is provided', () => {
    const scalar = () => Math.PI;

    const testFn = tryMax(5, scalar);
    expect(testFn()).toEqual(Math.PI);
  });
});
