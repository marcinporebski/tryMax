import { tryMaxExecutor } from './tryMaxExecutor';
import { MaybeAsyncFunction } from './interfaces';
import { oneSecond } from './consts';
import { retryAlways } from './retryPolicies';

export function tryMax(
  numberOfRetries: number,
  func: MaybeAsyncFunction,
  delay = oneSecond,
  retryCondition: MaybeAsyncFunction = retryAlways
): MaybeAsyncFunction {
  return (...args) =>
    tryMaxExecutor(numberOfRetries, () => func(...args), delay, retryCondition);
}
