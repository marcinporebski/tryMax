"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryIf = (condition) => () => Promise.resolve(condition());
exports.retryAlways = exports.retryIf(() => true);
