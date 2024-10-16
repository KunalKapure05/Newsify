"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const db_1 = __importDefault(require("../config/db"));
const validate_1 = require("../Validation/validate");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const register = async (req, res) => {
    try {
        const validatedData = validate_1.userSchema.parse(req.body);
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(validatedData.password, salt);
        validatedData.password = hashedPassword;
        const newUser = await db_1.default.user.create({
            data: validatedData,
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: error.errors });
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
