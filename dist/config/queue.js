"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultQueueConfig = exports.redisConnection = void 0;
const config_1 = require("./config");
const redisConnection = {
    host: config_1.config.host,
    port: config_1.config.Port
};
exports.redisConnection = redisConnection;
const defaultQueueConfig = {
    removeOnComplete: {
        count: 100,
        age: 60 * 60 * 24
    },
    attempts: 4,
    backoff: 1000
};
exports.defaultQueueConfig = defaultQueueConfig;
