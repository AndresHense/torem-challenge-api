import { Request, Response, NextFunction } from 'express';
import { User, Chat, Message, StatusError } from '../models';
import database from '../database/fetchDatabase';

export default {
	filterMessages: (
		args: any,
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { userId, chatId, filter } = args;
			const chat = database.getUserChat(userId, chatId);
			if (!chat) {
				const error = new StatusError('Could not find user chat', 404);
				return next(error);
			}
			return chat.messages.filter((msg) =>
				msg.message.toLowerCase().includes(filter.toLowerCase())
			);
		} catch (error) {
			next(error);
		}
	}
};
