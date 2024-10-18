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
router.post('/auth/register', AuthController_1.register);
router.post('/auth/login', AuthController_1.login);
router.get('/auth/logout', jwtAuth_1.default, AuthController_1.logout);
router.get('/profile', jwtAuth_1.default, ProfileController_1.getUser);
router.put('/profile/:id', ProfileController_1.updateUserProfile);
router.post('/news/', jwtAuth_1.default, NewsController_1.createNews);
exports.default = router;
