"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const fetchDatabase_1 = __importDefault(require("../database/fetchDatabase"));
exports.default = {
    filterMessages: (args, req, res, next) => {
        try {
            const { userId, chatId, filter } = args;
            const chat = fetchDatabase_1.default.getUserChat(userId, chatId);
            if (!chat) {
                const error = new models_1.StatusError('Could not find user chat', 404);
                return next(error);
            }
            return chat.messages.filter((msg) => msg.message.toLowerCase().includes(filter.toLowerCase()));
        }
        catch (error) {
            next(error);
        }
    }
};
