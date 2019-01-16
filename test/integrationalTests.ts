import { Builder } from '../src/tryMaxBuilder';

const just10milliseconds = () => 10;

jest.mock('../src/tryMaxExecutor', () => ({
  tryMaxExecutor: jest.fn().mockImplementation(() => 'tryMaxExecutor'),
}));

describe('tryMax', () => {
  it('should return tryMaxExecutor', () => {
    const { tryMax } = require('../src/tryMax');
    const testFn = tryMax(5, () => null);

    expect(testFn()).toEqual('tryMaxExecutor');
  });

  it('should return tryMaxBuilder factory', () => {
    const { tryMax } = require('../src/tryMax');
    const testFactory = tryMax(5);

    expect(testFactory).toHaveProperty('of');
    expect(typeof testFactory.of).toEqual('function');
  });

  it('tryMaxBuilder factory should return builder', () => {
    const { tryMax } = require('../src/tryMax');
    const testBuilder = tryMax(5).of(() => null);

    expect(testBuilder).toBeInstanceOf(Builder);
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
      {
        retryCondition,
        delay: just10milliseconds,
      }
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

describe('tryMaxBuilder', () => {
  it('should setup delay function', () => {
    const { tryMax } = require('../src/tryMax');
    const delayFunction = () => 5;

    const test = tryMax(5)
      .of(() => null)
      .delay(delayFunction);

    expect(test.policy.delay).toEqual(delayFunction);
  });

  it('should setup retry function', () => {
    const { tryMax } = require('../src/tryMax');
    const retryFunction = () => true;

    const test = tryMax(5)
      .of(() => null)
      .retryIf(retryFunction);

    expect(test.policy.retryCondition).toEqual(retryFunction);
  });

  it('should enable to change general function', () => {
    const { tryMax } = require('../src/tryMax');
    const general1 = () => 'general1';
    const general2 = () => 'general2';

    const test = tryMax(5).of(general1);
    expect(test.function).toEqual(general1);
    expect(test.of(general2).function).toEqual(general2);
  });
});
