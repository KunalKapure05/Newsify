"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("./config");
const logger_1 = __importDefault(require("./logger"));
const transporter = nodemailer_1.default.createTransport({
    host: config_1.config.smtp_host,
    port: parseInt(config_1.config.smtp_port),
    secure: false,
    auth: {
        user: config_1.config.smtp_user,
        pass: config_1.config.smtp_password
    },
});
exports.transporter = transporter;
const sendEmail = async (toMail, subject, body) => {
    try {
        const info = await transporter.sendMail({
            from: config_1.config.email_from, // sender address
            to: toMail, // list of receivers
            subject: subject, // Subject line
            text: body, // plain text body
        });
        console.log(info);
    }
    catch (error) {
        console.error("Error sending email:", error);
        logger_1.default.error("Error sending email:", error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
