import { MaybeAsyncFunction } from './interfaces';
export declare function tryMax(numberOfRetries: number, func: MaybeAsyncFunction, delay?: (n: number) => number, retryCondition?: MaybeAsyncFunction): MaybeAsyncFunction;
