import { MaybeAsyncFunction, DelayFunction } from './interfaces';
export declare function tryMaxExecutor(numberOfRetries: number, func: MaybeAsyncFunction, delay: DelayFunction, retryCondition: MaybeAsyncFunction, attemptNumber?: number, lastFailedResult?: any): Promise<any>;
