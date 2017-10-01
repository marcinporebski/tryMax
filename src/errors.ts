export const failAfterAllRetries = (n: number, lastFailedResult: any) => {
  return Promise.reject(
    lastFailedResult || `Failed to accomplish the task despite ${n} retries.`
  );
};
