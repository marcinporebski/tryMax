"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tryMaxExecutor_1 = require("./tryMaxExecutor");
const consts_1 = require("./consts");
const retryPolicies_1 = require("./retryPolicies");
function tryMax(numberOfRetries, func, delay = consts_1.oneSecond, retryCondition = retryPolicies_1.retryAlways) {
    return (...args) => tryMaxExecutor_1.tryMaxExecutor(numberOfRetries, () => func(...args), delay, retryCondition);
}
exports.tryMax = tryMax;
