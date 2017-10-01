export interface MaybeAsyncFunction {
    (...args: any[]): Promise<any> | any;
}
export interface DelayFunction {
    (n: number): number;
}
