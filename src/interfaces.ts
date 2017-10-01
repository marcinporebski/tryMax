export interface MaybeAsyncFunction {
  (...args): Promise<any> | any;
}

export interface DelayFunction {
  (n: number): number;
}
