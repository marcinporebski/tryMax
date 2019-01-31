import { MaybeAsyncFunction, DelayFunction } from './interfaces';
import { doNotRetry } from './consts';
import { failAfterAllRetries } from './errors';

export function tryMaxExecutor(
  numberOfRetries: number,
  func: MaybeAsyncFunction,
  delay: DelayFunction,
  retryCondition: MaybeAsyncFunction,
  attemptNumber = 0,
  lastFailedResult: any = null
): Promise<any> {
  const isFirstAttempt = () => attemptNumber === 0;
  const enoughRetries = () => attemptNumber >= numberOfRetries;
  const isNotPromise = (result: any) => !result.then;
  const delayRetry = (delay: number) =>
    new Promise(resolve => setTimeout(resolve, delay));

  const anotherAttempt = (success: boolean, result: any) => {
    if (success && result !== doNotRetry) {
      return result;
    }
    return delayRetry(delay(attemptNumber + 1)).then(() =>
      tryMaxExecutor(
        numberOfRetries,
        func,
        delay,
        retryCondition,
        attemptNumber + 1,
        result
      )
    );
  };

  if (isFirstAttempt()) {
    const firstAttemptResult = func();
    if (isNotPromise(firstAttemptResult)) {
      return firstAttemptResult;
    }

    return firstAttemptResult.then(
      res => anotherAttempt(true, res),
      res => anotherAttempt(false, res)
    );
  }

  if (enoughRetries()) {
    return failAfterAllRetries(
      numberOfRetries,
      lastFailedResult === doNotRetry ? null : lastFailedResult
    );
  }

  return retryCondition()
    .then(retry => {
      switch(true) {
        case retry === true:
          return func();
        case retry === false:
          return doNotRetry;
        default:
          return {return: retry};
      }
    })
    .then(res => {
      if (res.return) {
        return res.return;
      }

      return anotherAttempt(true, res)
    }, res => anotherAttempt(false, res));
}
