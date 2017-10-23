import { MaybeAsyncFunction, RetryPolicy, DelayFunction } from './interfaces';

export interface tryMaxBuilder<T extends MaybeAsyncFunction> {
    of<T extends MaybeAsyncFunction>(func: T): tryMaxBuilder<typeof func>;
  
    pause: (d: DelayFunction) => tryMaxBuilder<T>;
    delay: (d: DelayFunction) => tryMaxBuilder<T>;
  
    retryIf: (conditioner: MaybeAsyncFunction) => tryMaxBuilder<T>;
  
    // takes only the success result
    map<K>(f: (result: any) => K): K;
    // take all failed results and the success one too
    flatMap<K>(f: (result: any) => K): [K];
}
