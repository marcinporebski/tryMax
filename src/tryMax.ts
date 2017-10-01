import { tryMaxExecutor } from './tryMaxExecutor';
import { MaybeAsyncFunction, Options } from './interfaces';
import { oneSecond } from './consts';
import { retryAlways } from './retryPolicies';

export const defaultOptions: Options = {
  delay: oneSecond,
  retryCondition: retryAlways
};

export function tryMax<T extends MaybeAsyncFunction>(
  numberOfRetries: number,
  func: T,
  options: Partial<Options> = defaultOptions
): typeof func {
  const finalOptions = {...defaultOptions, ...options};
  return ((...args) =>
    tryMaxExecutor(numberOfRetries, () => func(...args), finalOptions.delay, finalOptions.retryCondition)) as T;
}
