/* eslint-disable @typescript-eslint/no-require-imports */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ['query', 'error']
});
exports.default = prisma;
