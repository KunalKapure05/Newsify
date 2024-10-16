"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(191, { message: "Name cannot exceed 191 characters." }),
    email: zod_1.z.string()
        .email({ message: "Invalid email format." }) // Custom email error message
        .max(191, { message: "Email cannot exceed 191 characters." }),
    password: zod_1.z.string()
        .min(5, { message: "Password must be at least 8 characters long." }),
    profile: zod_1.z.string().optional(),
});
