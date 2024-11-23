"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailSender = exports.logout = exports.login = exports.register = void 0;
const db_1 = __importDefault(require("../DB/db"));
const validate_1 = require("../Validation/validate");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config/config");
const logger_1 = __importDefault(require("../config/logger"));
const mailer_1 = require("../config/mailer");
const emailSchema_1 = require("../Validation/emailSchema");
const register = async (req, res) => {
    try {
        const validatedData = validate_1.registerUserSchema.parse(req.body);
        const existingUser = await db_1.default.user.findUnique({
            where: { email: validatedData.email },
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(validatedData.password, salt);
        validatedData.password = hashedPassword;
        const newUser = await db_1.default.user.create({
            data: validatedData,
        });
        const token = (0, jsonwebtoken_1.sign)({ userId: newUser.id }, config_1.config.jwt_key, {
            expiresIn: "72h",
        });
        res.json({
            newUser: newUser,
            token: token,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        if (error instanceof zod_1.z.ZodError) {
            const messages = error.errors.map((err) => err.message);
            return res.status(400).json({ messages });
        }
        else if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
};
exports.register = register;
const login = async function (req, res) {
    try {
        const validatedData = validate_1.loginUserSchema.parse(req.body);
        const existingUser = await db_1.default.user.findUnique({
            where: { email: validatedData.email },
        });
        if (!existingUser) {
            return res
                .status(400)
                .json({ message: "User Not found, please register first" });
        }
        const validPassword = await bcrypt_1.default.compare(validatedData.password, existingUser.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid Password" });
        }
        const token = (0, jsonwebtoken_1.sign)({ userId: existingUser.id }, config_1.config.jwt_key, {
            expiresIn: "72h",
        });
        res.cookie("token", token, {
            path: "/",
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            sameSite: "lax",
        });
        res.json({
            message: `${existingUser.name} login succesfully`,
            token,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        if (error instanceof zod_1.z.ZodError) {
            const messages = error.errors.map((err) => err.message);
            return res.status(400).json({ messages });
        }
        else if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        res.clearCookie("token", { path: "/" });
        const _req = req;
        const userId = parseInt(_req.userId, 10);
        console.log("Parsed userId as number:", userId);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        const user = await db_1.default.user.findFirst({
            where: {
                id: userId, // Directly compare the id
            },
        });
        const name = user?.name;
        return res.json({ user: `${name} has logged out` });
    }
    catch (error) {
        logger_1.default.error(error);
        return res.status(500).json({ message: "Error Logging out", error: error });
    }
};
exports.logout = logout;
const emailSender = async (req, res) => {
    try {
        const validatedData = emailSchema_1.emailSchema.parse(req.body);
        const { toMail, subject, body } = validatedData;
        await (0, mailer_1.sendEmail)(toMail, subject, body);
        return res.status(200).json({ message: " Email sent successfully",
            payload: {
                toMail,
                subject,
                body,
            } });
    }
    catch (error) {
        logger_1.default.error(error);
        if (error instanceof zod_1.z.ZodError) {
            const messages = error.errors.map((err) => err.message);
            return res.status(400).json({ messages });
        }
        else if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Error while sending an e-mail,please try again later " });
        }
    }
};
exports.emailSender = emailSender;
