"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChat = exports.sendMessage = exports.createChat = exports.getUserChats = void 0;
const fetchDatabase_1 = __importDefault(require("../database/fetchDatabase"));
const models_1 = require("../models");
const socket_1 = require("../socket");
/*
    CHAT CONTROLLERS
*/
const getUserChats = (req, res, next) => {
    const { userId } = req.params;
    try {
        // @ts-ignore
        if (!req.userId || req.userId !== userId) {
            res.status(401).json({ message: 'Unauthorized action' });
            return;
        }
        const chats = fetchDatabase_1.default.getUserChats(userId);
        res.status(200).json({ chats });
        return;
    }
    catch (error) {
        const statusError = new models_1.StatusError('Unauthorized action', 401);
        next(statusError);
    }
};
exports.getUserChats = getUserChats;
const createChat = (req, res, next) => {
    var _a;
    const { userId } = req.params;
    // @ts-ignore
    if (!req.userId || req.userId !== userId) {
        res.status(401).json({ message: 'Unauthorized action' });
        return;
    }
    try {
        const { name } = req.body;
        const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        if (name && image) {
            const chat = new models_1.Chat(name, image);
            fetchDatabase_1.default.createChat(userId, chat);
            // @ts-ignore
            (0, socket_1.getIO)().emit('chats', { action: 'create', userId, chatId: chat.chatId });
            res.status(201).json({ message: 'Chat created successfully' });
            return;
        }
        else {
            res
                .status(400)
                .json({ message: 'Must provide a valid recipient name and image' });
            return;
        }
    }
    catch (error) {
        const statusError = new models_1.StatusError('Error while fetching data', 500);
        next(statusError);
    }
};
exports.createChat = createChat;
const sendMessage = (req, res, next) => {
    const { userId, chatId } = req.params;
    // @ts-ignore
    if (!req.userId || req.userId !== userId) {
        res.status(401).json({ message: 'Unauthorized action' });
        return;
    }
    try {
        const chat = fetchDatabase_1.default.getUserChat(userId, chatId);
        if (chat) {
            const { message } = req.body;
            const msg = new models_1.Message(message, false);
            fetchDatabase_1.default.sendMessage(userId, chatId, msg);
            // @ts-ignore
            (0, socket_1.getIO)().emit('chats', {
                action: 'SentNewMessage',
                userId,
                chatId: chat.chatId
            });
            res.status(201).json({ message: 'Message sent successfully' });
            // sends reply after 5 seconds
            setTimeout(() => sendReplyMessage(userId, chatId), 5000);
            return;
        }
        else {
            res.status(404).json({ message: 'Could not find user chat' });
            return;
        }
    }
    catch (error) {
        const statusError = new models_1.StatusError('Error while fetching data', 500);
        next(statusError);
    }
};
exports.sendMessage = sendMessage;
const deleteChat = (req, res, next) => {
    const { userId, chatId } = req.params;
    // @ts-ignore
    if (!req.userId || req.userId !== userId) {
        res.status(401).json({ message: 'Unauthorized action' });
        return;
    }
    try {
        const chat = fetchDatabase_1.default.getUserChat(userId, chatId);
        if (chat) {
            fetchDatabase_1.default.deleteChat(userId, chatId);
            // @ts-ignore
            (0, socket_1.getIO)().emit('chats', {
                action: 'delete',
                userId,
                chatId: chat.chatId
            });
            res.status(201).json({ message: 'Chat history deleted successfully' });
            return;
        }
        else {
            res.status(404).json({ message: 'Could not find user chat' });
            return;
        }
    }
    catch (error) {
        const statusError = new models_1.StatusError('Error while fetching data', 500);
        next(statusError);
    }
};
exports.deleteChat = deleteChat;
const sendReplyMessage = (userId, chatId) => {
    try {
        const chat = fetchDatabase_1.default.getUserChat(userId, chatId);
        if (chat) {
            const text = `Este es un mensaje de prueba! Deberías de recibir este mensaje luego de 5 segundos de haber enviado uno.`;
            const msg = new models_1.Message(text, true);
            fetchDatabase_1.default.sendMessage(userId, chatId, msg);
            // @ts-ignore
            (0, socket_1.getIO)().emit('chats', {
                action: 'ReceivedNewMessage',
                userId,
                chatId: chat.chatId
            });
        }
    }
    catch (error) {
        // @ts-ignore
        socket_1.getIO.emit('chats', {
            action: 'error',
            error: 'Could not fetch database while sending a reply message'
        });
    }
};
