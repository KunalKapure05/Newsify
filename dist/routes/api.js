"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const ProfileController_1 = require("../controllers/ProfileController");
const jwtAuth_1 = __importDefault(require("../middlewares/jwtAuth"));
const NewsController_1 = require("../controllers/NewsController");
const router = (0, express_1.Router)();
// Auth routes
router.post('/auth/register', AuthController_1.register);
router.post('/auth/login', AuthController_1.login);
router.get('/auth/logout', jwtAuth_1.default, AuthController_1.logout);
// Profile routes
router.get('/profile', jwtAuth_1.default, ProfileController_1.getUser);
router.put('/profile/:id', jwtAuth_1.default, ProfileController_1.updateUserProfile);
// News routes
router.post('/news', jwtAuth_1.default, NewsController_1.createNews);
router.get('/news', NewsController_1.getAllNews);
router.get('/news/:id', NewsController_1.showNews);
router.put('/news/:id', jwtAuth_1.default, NewsController_1.updateNews);
exports.default = router;
