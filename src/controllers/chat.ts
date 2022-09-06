import { Request, Response, NextFunction } from 'express';
import database from '../database/fetchDatabase';
import { Chat, Message, StatusError } from '../models';
import { getIO } from '../socket';

interface ControllerFunction {
	(req: Request, res: Response, next: NextFunction): void;
}

/*
    CHAT CONTROLLERS
*/
export const getUserChats: ControllerFunction = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const { userId } = req.params;
	try {
		// @ts-ignore
		if (!req.userId || req.userId !== userId) {
			res.status(401).json({ message: 'Unauthorized action' });
			return;
		}
		const chats = database.getUserChats(userId);
		res.status(200).json({ chats });
		return;
	} catch (error) {
		const statusError = new StatusError('Unauthorized action', 401);
		next(statusError);
	}
};

export const createChat: ControllerFunction = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const { userId } = req.params;
	// @ts-ignore
	if (!req.userId || req.userId !== userId) {
		res.status(401).json({ message: 'Unauthorized action' });
		return;
	}
	try {
		const { name } = req.body;
		const image = req.file?.path;
		if (name && image) {
			const chat = new Chat(name, image);
			database.createChat(userId, chat);
			// @ts-ignore
			getIO().emit('chats', { action: 'create', userId, chatId: chat.chatId });
			res.status(201).json({ message: 'Chat created successfully' });
			return;
		} else {
			res
				.status(400)
				.json({ message: 'Must provide a valid recipient name and image' });
			return;
		}
	} catch (error) {
		const statusError = new StatusError('Error while fetching data', 500);
		next(statusError);
	}
};

export const sendMessage: ControllerFunction = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const { userId, chatId } = req.params;
	// @ts-ignore
	if (!req.userId || req.userId !== userId) {
		res.status(401).json({ message: 'Unauthorized action' });
		return;
	}
	try {
		const chat = database.getUserChat(userId, chatId);
		if (chat) {
			const { message } = req.body;
			const msg = new Message(message, false);
			database.sendMessage(userId, chatId, msg);
			// @ts-ignore
			getIO().emit('chats', {
				action: 'SentNewMessage',
				userId,
				chatId: chat.chatId
			});
			res.status(201).json({ message: 'Message sent successfully' });
			// sends reply after 5 seconds
			setTimeout(() => sendReplyMessage(userId, chatId), 5000);
			return;
		} else {
			res.status(404).json({ message: 'Could not find user chat' });
			return;
		}
	} catch (error) {
		const statusError = new StatusError('Error while fetching data', 500);
		next(statusError);
	}
};

export const deleteChat: ControllerFunction = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const { userId, chatId } = req.params;
	// @ts-ignore
	if (!req.userId || req.userId !== userId) {
		res.status(401).json({ message: 'Unauthorized action' });
		return;
	}
	try {
		const chat = database.getUserChat(userId, chatId);
		if (chat) {
			database.deleteChat(userId, chatId);
			// @ts-ignore
			getIO().emit('chats', {
				action: 'delete',
				userId,
				chatId: chat.chatId
			});
			res.status(201).json({ message: 'Chat history deleted successfully' });
			return;
		} else {
			res.status(404).json({ message: 'Could not find user chat' });
			return;
		}
	} catch (error) {
		const statusError = new StatusError('Error while fetching data', 500);
		next(statusError);
	}
};

import { id } from '../models';

const sendReplyMessage = (userId: id, chatId: id): void => {
	try {
		const chat = database.getUserChat(userId, chatId);
		if (chat) {
			const text = `Este es un mensaje de prueba! Deberías de recibir este mensaje luego de 5 segundos de haber enviado uno.`;
			const msg = new Message(text, true);
			database.sendMessage(userId, chatId, msg);
			// @ts-ignore
			getIO().emit('chats', {
				action: 'ReceivedNewMessage',
				userId,
				chatId: chat.chatId
			});
		}
	} catch (error) {
		// @ts-ignore
		getIO.emit('chats', {
			action: 'error',
			error: 'Could not fetch database while sending a reply message'
		});
	}
};
