import { Router } from 'express';
import {
	getUserChats,
	createChat,
	sendMessage,
	deleteChat
} from '../controllers/chat';
import { isAuth } from '../controllers/auth';

const router = Router();

/*
    CHATS ROUTES
*/
router.get('/chat/:userId', isAuth, getUserChats);
router.post('/chat/:userId', isAuth, createChat);
router.post('/chat/:userId/:chatId', isAuth, sendMessage);
router.delete('/chat/:userId/:chatId', isAuth, deleteChat);

export default router;
