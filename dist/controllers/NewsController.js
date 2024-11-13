"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNews = exports.updateNews = exports.showNews = exports.getAllNews = exports.createNews = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const zod_1 = require("zod");
const db_1 = __importDefault(require("../DB/db"));
const newsValidate_1 = require("../Validation/newsValidate");
const helper_1 = require("../utils/helper");
const NewsApiTransform_1 = __importDefault(require("../utils/NewsApiTransform"));
const redis_1 = __importDefault(require("../DB/redis"));
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
        const imgExt = file?.name.split(".");
        const imageName = (0, helper_1.generateRandomNumber)() + "." + imgExt[1]; // Generate a valid image name
        const ImagefilePath = process.cwd() + "/public/images/" + imageName;
        // Move the file to the target location
        await file.mv(ImagefilePath);
        const _req = req;
        const userId = Number(_req.userId);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        const user = await db_1.default.user.findFirst({
            where: {
                id: userId,
            },
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
                name: name,
            },
        });
        //Remove Cache
        redis_1.default.del("/api/news", (error) => {
            if (error)
                throw error;
        });
        return res.status(200).json({ news });
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
const getAllNews = async function (req, res) {
    try {
        let page = Number(req.query.page) || 1;
        if (page <= 0)
            page = 1;
        let limit = Number(req.query.limit) || 1;
        if (limit <= 0 || limit > 100)
            limit = 10;
        const skip = (page - 1) * limit;
        const news = await db_1.default.news.findMany({
            take: limit,
            skip: skip,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profile: true,
                    },
                },
            },
        });
        const newsTransform = await Promise.all(news.map((item) => (0, NewsApiTransform_1.default)(item)));
        const totalNews = await db_1.default.news.count();
        const totalPages = Math.ceil(totalNews / limit);
        return res.status(200).json({
            news: newsTransform,
            metadata: {
                totalPages: totalPages,
                currentPage: page,
                limit: limit,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ message: "An unexpected error occurred" });
    }
};
exports.getAllNews = getAllNews;
const showNews = async function (req, res) {
    try {
        const id = req.params.id;
        const news = await db_1.default.news.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profile: true,
                    },
                },
            },
        });
        const newsTransform = news ? await (0, NewsApiTransform_1.default)(news) : null;
        return res.status(200).json({ news: newsTransform });
    }
    catch (error) {
        return res.status(500).json({ message: "An unexpected error occurred" });
    }
};
exports.showNews = showNews;
const updateNews = async function (req, res) {
    try {
        const { id } = req.params;
        const validatedData = newsValidate_1.newsSchema.parse(req.body);
        const _req = req;
        console.log("Extracted userId from token:", _req.userId);
        const userId = Number(_req.userId);
        const news = await db_1.default.news.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (userId !== news?.user_id) {
            return res
                .status(403)
                .json({ message: "Unauthorized to update this news" });
        }
        const image = req?.files?.image;
        if (image) {
            // Check if `image` is an array
            const singleImage = Array.isArray(image) ? image[0] : image;
            // Validate the image file
            const message = (0, helper_1.imageValidator)(singleImage.size, singleImage.mimetype);
            if (message !== null) {
                return res.status(400).json({
                    errors: {
                        image: message,
                    },
                });
            }
            // Upload new image
            const imgExt = singleImage.name.split(".");
            const imageName = (0, helper_1.generateRandomNumber)() + "." + imgExt[imgExt.length - 1]; // Generate a valid image name
            const imageFilePath = process.cwd() + "/public/images/" + imageName;
            // Move the file to the target location
            await singleImage.mv(imageFilePath);
            //Delete old image
            (0, helper_1.removeImage)(news.image);
            const updatedNews = await db_1.default.news.update({
                where: { id: Number(id) },
                data: {
                    ...validatedData,
                    image: imageName,
                },
            });
            return res
                .status(200)
                .json({ message: "News updated successfully", news: updatedNews });
        }
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
exports.updateNews = updateNews;
const deleteNews = async function (req, res) {
    try {
        const { id } = req.params;
        const _req = req;
        console.log("Extracted userId from token:", _req.userId);
        const userId = Number(_req.userId);
        const news = await db_1.default.news.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (userId !== news?.user_id) {
            return res
                .status(403)
                .json({ message: "Unauthorized to delete this news" });
        }
        //Delete image from fileSystem
        (0, helper_1.removeImage)(news.image);
        const response = await db_1.default.news.delete({
            where: {
                id: Number(id),
            },
        });
        return res
            .status(200)
            .json({ message: "News deleted successfully", news: response });
    }
    catch (error) {
        return res.status(500).json({ message: "An unexpected error occurred" });
    }
};
exports.deleteNews = deleteNews;
