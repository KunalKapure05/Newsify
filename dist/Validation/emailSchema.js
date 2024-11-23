"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailSchema = void 0;
const zod_1 = require("zod");
exports.emailSchema = zod_1.z.object({
    toMail: zod_1.z.string().email("Invalid email address"),
    subject: zod_1.z.string().min(1, "Subject cannot be empty"),
    body: zod_1.z.string().min(1, "Body cannot be empty"),
});
