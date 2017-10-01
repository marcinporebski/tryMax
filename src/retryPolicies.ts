export const retryIf = (condition: () => boolean) => () =>
  Promise.resolve(condition());
export const retryAlways = retryIf(() => true);
