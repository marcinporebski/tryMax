"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doNotRetry = Symbol('doNotRetry');
exports.second = 1000;
exports.timeDelay = (ms) => (n) => ms;
exports.oneSecond = exports.timeDelay(1 * exports.second);
exports.twoSeconds = exports.timeDelay(2 * exports.second);
exports.fiveSeconds = exports.timeDelay(5 * exports.second);
exports.expBackoff = (n) => Math.pow(2, n - 1) * exports.second;
