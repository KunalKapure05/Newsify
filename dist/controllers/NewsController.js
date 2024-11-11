"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNews = exports.createNews = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const zod_1 = require("zod");
const db_1 = __importDefault(require("../config/db"));
const newsValidate_1 = require("../Validation/newsValidate");
const helper_1 = require("../utils/helper");
const NewsApiTransform_1 = __importDefault(require("../utils/NewsApiTransform"));
const createNews = async function (req, res) {
    try {
        const validatedData = newsValidate_1.newsSchema.parse(req.body);
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: "Image field required" });
        }
        const image = req.files?.image;
        if (!image) {
            return res.status(400).json({ message: "No image file provided" });
        }
        const file = Array.isArray(image) ? image[0] : image;
        const message = (0, helper_1.imageValidator)(file.size, file.mimetype);
        if (message !== null) {
            return res.status(400).json({ message });
        }
        // Image Upload
        const imgExt = file?.name.split('.');
        const imageName = (0, helper_1.generateRandomNumber)() + "." + imgExt[1]; // Generate a valid image name
        const ImagefilePath = process.cwd() + '/public/images/' + imageName;
        // Move the file to the target location
        await file.mv(ImagefilePath);
        const _req = req;
        const userId = Number(_req.userId);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        const user = await db_1.default.user.findFirst({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const name = user.name;
        const news = await db_1.default.news.create({
            data: {
                ...validatedData,
                image: imageName,
                user_id: userId,
                name: name
            }
        });
        return res.status(200).json({ news
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "An unexpected error occurred" });
    }
};
exports.createNews = createNews;
const getNews = async function (req, res) {
    try {
        const news = await db_1.default.news.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profile: true
                    }
                }
            }
        });
        const newsTransform = await Promise.all(news.map(item => (0, NewsApiTransform_1.default)(item)));
        return res.status(200).json({ news: newsTransform });
    }
    catch (error) {
        return res.status(500).json({ message: "An unexpected error occurred" });
    }
};
exports.getNews = getNews;
