"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const models_1 = require("../models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { verify } = jsonwebtoken_1.default;
/*
    IS AUTH CONTROLLER
*/
const isAuth = (req, res, next) => {
    // 1. Get auth header
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const statusError = new models_1.StatusError('Unauthorized action', 401);
        next(statusError);
    }
    // 2. obtain token
    // @ts-ignore
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = verify(token, 'toremsoftware');
    }
    catch (error) {
        const statusError = new models_1.StatusError('Unauthorized action', 401);
        next(statusError);
    }
    // 3. verify
    if (!decodedToken) {
        const statusError = new models_1.StatusError('Unauthorized action', 401);
        next(statusError);
    }
    // @ts-ignore
    req.userId = decodedToken.userId;
    next();
};
exports.isAuth = isAuth;
