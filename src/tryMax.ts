import { tryMaxExecutor } from './tryMaxExecutor';
import { TryMaxBuilder, builderFactory } from './tryMaxBuilder';
import { MaybeAsyncFunction, RetryPolicy, DelayFunction } from './interfaces';
import { oneSecond } from './consts';
import { retryAlways } from './retryPolicies';

export const defaultPolicy: RetryPolicy = {
  delay: oneSecond,
  retryCondition: retryAlways,
};

export function tryMax<T extends MaybeAsyncFunction>(
  numberOfRetries: number,
  func: T
): typeof func;
export function tryMax<T extends MaybeAsyncFunction>(
  numberOfRetries: number,
  func: T,
  policy: Partial<RetryPolicy>
): typeof func;
export function tryMax<T extends MaybeAsyncFunction>(
  numberOfRetries: number
): TryMaxBuilder<T>;
export function tryMax<T extends MaybeAsyncFunction>(
  numberOfRetries: number,
  func: T = null,
  policy: Partial<RetryPolicy> = defaultPolicy
): typeof func | TryMaxBuilder<T> {
  if (func === null) {
    return builderFactory(numberOfRetries) as TryMaxBuilder<T>;
  }

  const finalPolicy = { ...defaultPolicy, ...policy };
  return ((...args) =>
    tryMaxExecutor(
      numberOfRetries,
      () => func(...args),
      finalPolicy.delay,
      finalPolicy.retryCondition
    )) as T;
}
