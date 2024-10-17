"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const api_1 = __importDefault(require("./routes/api"));
app.use((0, express_fileupload_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.json("Welcome to homepage!");
});
app.use('/api', api_1.default);
exports.default = app;
