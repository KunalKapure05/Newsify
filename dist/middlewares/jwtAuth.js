"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config/config");
const jwtAuthMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({ message: "Token not found" });
    }
    try {
        const token = authorization.split(" ")[1];
        const decoded = (0, jsonwebtoken_1.verify)(token, config_1.config.jwt_key);
        const _req = req;
        _req.userId = decoded.userId;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return res.status(401).send("Expired token");
        }
        else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            return res.status(401).send("Invalid JWT token");
        }
        else {
            return res.status(401).send("Token verification failed");
        }
    }
};
exports.default = jwtAuthMiddleware;
