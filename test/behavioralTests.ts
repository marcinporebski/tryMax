import { tryMax } from '../src/tryMax';
import { retryIf } from '../src/retryPolicies';

const just10milliseconds = () => 10;

describe('tryMax', () => {
  it('should retry function if it fails', () => {
    const fn = jest.fn(() => Promise.reject('allwaysReject'));
    const testFn = tryMax(5, fn, { delay: just10milliseconds });

    return testFn().then(
      never => {
        expect(never).toBe('here');
      },
      () => {
        expect(fn).toHaveBeenCalledTimes(5);
      }
    );
  });

  it('should not retry function if the retry condition is falsy', () => {
    const fn = jest.fn(() => Promise.reject('allwaysReject'));
    const retryFn = jest.fn(retryIf(() => false));
    const testFn = tryMax(5, fn, {
      delay: just10milliseconds,
      retryCondition: retryFn,
    });

    return testFn().then(
      never => {
        expect(never).toBe('here');
      },
      () => {
        expect(fn).toHaveBeenCalledTimes(1);
        expect(retryFn).toHaveBeenCalledTimes(4);
      }
    );
  });

  it('should retry function until it is success', () => {
    let attempt = 0;

    const fn = jest.fn(() => {
      attempt = attempt + 1;
      if (attempt > 3) {
        return Promise.resolve('success');
      } 
      return Promise.reject('failure');
    });
    const testFn = tryMax(5, fn, { delay: just10milliseconds });

    return testFn().then(
      result => {
        expect(fn).toHaveBeenCalledTimes(4);
        expect(result).toEqual('success');
      },
      never => {
        expect(never).toBe('here');
      }
    );
  });
});
