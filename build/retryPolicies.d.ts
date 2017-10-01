export declare const retryIf: (condition: () => boolean) => () => Promise<boolean>;
export declare const retryAlways: () => Promise<boolean>;
