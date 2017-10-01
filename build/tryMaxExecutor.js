"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
const errors_1 = require("./errors");
function tryMaxExecutor(numberOfRetries, func, delay, retryCondition, attemptNumber = 0, lastFailedResult = null) {
    const isFirstAttempt = () => attemptNumber === 0;
    const enoughRetries = () => attemptNumber >= numberOfRetries;
    const isNotPromise = (result) => !(result instanceof Promise);
    const delayRetry = (delay) => new Promise(resolve => setTimeout(resolve, delay));
    const anotherAttempt = (success, result) => {
        if (success && result !== consts_1.doNotRetry) {
            return result;
        }
        return delayRetry(delay(attemptNumber + 1)).then(() => tryMaxExecutor(numberOfRetries, func, delay, retryCondition, attemptNumber + 1, result));
    };
    if (isFirstAttempt()) {
        const firstAttemptResult = func();
        if (isNotPromise(firstAttemptResult)) {
            return firstAttemptResult;
        }
        return firstAttemptResult.then(res => anotherAttempt(true, res), res => anotherAttempt(false, res));
    }
    if (enoughRetries()) {
        return errors_1.failAfterAllRetries(numberOfRetries, lastFailedResult === consts_1.doNotRetry ? null : lastFailedResult);
    }
    return retryCondition()
        .then(retry => (retry ? func() : consts_1.doNotRetry))
        .then(res => anotherAttempt(true, res), res => anotherAttempt(false, res));
}
exports.tryMaxExecutor = tryMaxExecutor;
