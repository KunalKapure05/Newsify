"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsSchema = void 0;
const zod_1 = require("zod");
exports.newsSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(191, { message: "Name cannot exceed 191 characters." }),
    content: zod_1.z.string().min(5, { message: "Content must be at least 5 characters long." }),
    image: zod_1.z.string().optional(),
    user_id: zod_1.z.number().optional(),
    name: zod_1.z.string().optional()
});
