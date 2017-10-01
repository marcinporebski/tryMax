import { tryMaxExecutor } from './tryMaxExecutor';
import { MaybeAsyncFunction } from './interfaces';
import { oneSecond } from './consts';
import { retryAlways } from './retryPolicies';

export function tryMax<T extends MaybeAsyncFunction>(
  numberOfRetries: number,
  func: T,
  delay = oneSecond,
  retryCondition: MaybeAsyncFunction = retryAlways
): typeof func {
  return ((...args) =>
    tryMaxExecutor(numberOfRetries, () => func(...args), delay, retryCondition)) as T;
}
