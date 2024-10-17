"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const db_1 = __importDefault(require("../config/db"));
const getUser = async function (req, res) {
    try {
        const _req = req;
        console.log("Extracted userId from token:", _req.userId);
        const userId = parseInt(_req.userId, 10);
        console.log("Parsed userId as number:", userId);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        const user = await db_1.default.user.findFirst({
            where: {
                id: userId, // Directly compare the id
            }
        });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        return res.json({ user });
    }
    catch (error) {
        console.error("Error occurred in getUser:", error);
        return res.status(500).json({ message: "An unexpected error occurred", error: error });
    }
};
exports.getUser = getUser;
