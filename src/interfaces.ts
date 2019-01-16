export interface MaybeAsyncFunction {
  (...args): Promise<any> | any;
}

export interface DelayFunction {
  (n: number): number;
}

export interface RetryPolicy {
  delay: DelayFunction;
  retryCondition: MaybeAsyncFunction;
}
