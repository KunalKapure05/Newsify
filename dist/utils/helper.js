"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageUrl = exports.generateRandomNumber = exports.bytesToMb = exports.imageValidator = void 0;
const config_1 = require("../config/config");
const fileSystem_1 = require("../config/fileSystem");
const imageValidator = (size, mime) => {
    if (bytesToMb(size) > 5)
        return "Image size must be less than 5 mb.";
    else if (!fileSystem_1.supportedMimes.includes(mime))
        return "Image must be type of png,jpeg,jpg,gif,svg... ";
    return null;
};
exports.imageValidator = imageValidator;
const bytesToMb = (bytes) => {
    return (bytes / 1024 / 1024);
};
exports.bytesToMb = bytesToMb;
const generateRandomNumber = () => {
    return Math.floor(Math.random() * 1000000).toString();
};
exports.generateRandomNumber = generateRandomNumber;
const getImageUrl = (imgName) => {
    return `${config_1.config.app_url}/images/${imgName}`;
};
exports.getImageUrl = getImageUrl;
