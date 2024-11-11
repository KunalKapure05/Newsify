"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const _config = {
    port: process.env.PORT,
    jwt_key: process.env.JWT_KEY,
    app_url: process.env.APP_URL
};
exports.config = Object.freeze(_config);
