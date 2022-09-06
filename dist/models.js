"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusError = exports.Message = exports.Chat = exports.User = void 0;
const uniqid_1 = __importDefault(require("uniqid"));
class User {
    constructor(name, lastName, email, password, image) {
        this.userId = (0, uniqid_1.default)();
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.image = image;
        this.chats = [];
    }
}
exports.User = User;
class Chat {
    constructor(name, image) {
        this.chatId = (0, uniqid_1.default)();
        this.name = name;
        this.image = image;
        this.messages = [];
    }
}
exports.Chat = Chat;
class Message {
    constructor(message, received) {
        this.messageId = (0, uniqid_1.default)();
        this.message = message;
        this.timeDate = new Date().toISOString();
        this.received = received;
    }
}
exports.Message = Message;
class StatusError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status || 500;
    }
}
exports.StatusError = StatusError;
