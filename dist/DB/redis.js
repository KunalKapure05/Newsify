"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_redis_cache_1 = __importDefault(require("express-redis-cache"));
const redisCache = (0, express_redis_cache_1.default)({
    port: 6379,
    host: 'localhost',
    expire: 60 * 60,
    prefix: 'Newsify'
});
exports.default = redisCache;
