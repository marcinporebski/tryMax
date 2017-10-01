const just10milliseconds = () => 10;

jest.mock('../src/tryMaxExecutor', () => ({
  tryMaxExecutor: () => 'tryMaxExecutor',
}));

describe('tryMax', () => {
  it('should return tryMaxExecutor', () => {
    const { tryMax } = require('../src/tryMax');
    const testFn = tryMax(5, () => null);

    expect(testFn()).toEqual('tryMaxExecutor');
  });
});

describe('tryMaxExecutor', () => {
  it('should check retryCondition', () => {
    jest.unmock('../src/tryMaxExecutor');
    jest.resetModules();
    const retryCondition = jest.fn(() => Promise.resolve(true));
    const { tryMax } = require('../src/tryMax');
    const testFn: () => Promise<any> = tryMax(
      5,
      () => Promise.reject('allwaysRejected'),
      just10milliseconds,
      retryCondition
    );

    return testFn().then(
      never => {
        expect(never).toBe('here');
      },
      () => {
        expect(retryCondition).toHaveBeenCalledTimes(4);
      }
    );
  });
});
