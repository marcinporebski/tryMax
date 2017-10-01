"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.failAfterAllRetries = (n, lastFailedResult) => {
    return Promise.reject(lastFailedResult || `Failed to accomplish the task despite ${n} retries.`);
};
