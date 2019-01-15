import { MaybeAsyncFunction, RetryPolicy, DelayFunction } from './interfaces';
import { defaultPolicy, tryMax } from './tryMax';

export interface tryMaxBuilder<T extends MaybeAsyncFunction> {
  of(func: T): this;
  execute: T;

  pause(d: DelayFunction): this;
  delay(d: DelayFunction): this;

  retryIf(conditioner: MaybeAsyncFunction): this;
}

export class Builder<T extends MaybeAsyncFunction> implements tryMaxBuilder<T> {
  protected delayFunction: DelayFunction;
  protected retryIfFunction: MaybeAsyncFunction;

  public execute: T;

  constructor(protected numberOfRetries: number, protected func: T) {
    this.delayFunction = defaultPolicy.delay;
    this.retryIfFunction = defaultPolicy.retryCondition;

    this.execute = ((...args) => {
      return this.executor(...args);
    }) as T;
  }

  of(func: T) {
    this.func = func;
    return this;
  }

  pause(d: DelayFunction) {
    this.delayFunction = d;
    return this;
  }

  delay(d: DelayFunction) {
    return this.pause(d);
  }

  retryIf(conditioner: MaybeAsyncFunction) {
    this.retryIfFunction = conditioner;
    return this;
  }

  get policy(): RetryPolicy {
    return {
      delay: this.delayFunction,
      retryCondition: this.retryIfFunction,
    };
  }

  get function() {
    return this.func;
  }

  get executor() {
    return tryMax(this.numberOfRetries, this.func, this.policy);
  }
}

export function builderFactory(numberOfRetries: number) {
  return {
    of: <T extends MaybeAsyncFunction>(func: T) =>
      new Builder(numberOfRetries, func) as tryMaxBuilder<typeof func>,
  };
}
