"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getUser = void 0;
const db_1 = __importDefault(require("../config/db"));
const helper_1 = require("../utils/helper");
const path_1 = __importDefault(require("path"));
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
const updateUserProfile = async function (req, res) {
    try {
        console.log("Request received:", req); // Log the entire request object
        console.log("Files received:", req.files); // Log the received files
        // Extract 'id' from URL parameters
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: "Profile image is required" });
        }
        const profile = req.files.profile;
        // Check if profile is an array or a single UploadedFile
        const file = Array.isArray(profile) ? profile[0] : profile;
        // Log the file details
        console.log("Profile file details:", file);
        const message = (0, helper_1.imageValidator)(file.size, file.mimetype);
        if (message !== null) {
            return res.status(400).json({
                errors: {
                    profile: message,
                },
            });
        }
        const imgExt = file?.name.split('.');
        const imageName = `${(0, helper_1.generateRandomNumber)()}.${imgExt[imgExt.length - 1]}`; // Generate a valid image name
        const ImagefilePath = path_1.default.resolve(__dirname, '../../public/images', imageName);
        // Move the file to the target location
        await file.mv(ImagefilePath);
        // Update user profile in the database
        const updatedData = await db_1.default.user.update({
            where: {
                id: parseInt(id, 10), // Ensure id is parsed to an integer from req.params
            },
            data: {
                profile: imageName,
            },
        });
        return res.status(200).json({
            updatedData,
            message: "Profile updated successfully"
        });
    }
    catch (error) {
        console.error("Error occurred in updateUserProfile:", error);
        return res.status(500).json({ message: "An unexpected error occurred", error: error });
    }
};
exports.updateUserProfile = updateUserProfile;
