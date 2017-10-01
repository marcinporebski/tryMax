export const doNotRetry = Symbol('doNotRetry');

export const second = 1000;
export const timeDelay = (ms: number) => (n: number) => ms;
export const oneSecond = timeDelay(1 * second);
export const twoSeconds = timeDelay(2 * second);
export const fiveSeconds = timeDelay(5 * second);
export const expBackoff = (n: number) => Math.pow(2, n - 1) * second;
