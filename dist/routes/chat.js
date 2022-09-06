"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_1 = require("../controllers/chat");
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
/*
    CHATS ROUTES
*/
router.get('/chat/:userId', auth_1.isAuth, chat_1.getUserChats);
router.post('/chat/:userId', auth_1.isAuth, chat_1.createChat);
router.post('/chat/:userId/:chatId', auth_1.isAuth, chat_1.sendMessage);
router.delete('/chat/:userId/:chatId', auth_1.isAuth, chat_1.deleteChat);
exports.default = router;
