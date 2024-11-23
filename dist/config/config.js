"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const _config = {
    port: process.env.PORT,
    jwt_key: process.env.JWT_KEY,
    app_url: process.env.APP_URL,
    smtp_port: process.env.SMTP_PORT,
    smtp_host: process.env.SMTP_HOST,
    smtp_user: process.env.SMTP_USER,
    smtp_password: process.env.SMTP_PASSWORD,
    email_from: process.env.EMAIL_FROM,
    host: process.env.REDIS_HOST,
    Port: parseInt(process.env.REDIS_PORT),
};
exports.config = Object.freeze(_config);
