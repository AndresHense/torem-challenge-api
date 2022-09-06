import fs from 'fs';
import path from 'path';
import { User, Chat, Message, id } from '../models';

type DB = User[];

const dataPath: string = path.join(__dirname, 'data.json');

const getDatabase = (): DB => {
	const rawJSON: string = fs.readFileSync(dataPath, 'utf-8');
	return JSON.parse(rawJSON) as DB;
};

const writeDatabase = (db: DB): void => {
	fs.writeFileSync(dataPath, JSON.stringify(db));
};

export default class Database {
	/*
        USERS
    */
	static getUserByEmail(email: string): User | undefined {
		const users: DB = getDatabase();
		return users.find((user) => user.email === email);
	}

	static getUser(userId: id): User | undefined {
		const users: DB = getDatabase();
		return users.find((user) => user.userId === userId);
	}

	static deleteUser(userId: id): void {
		let users: DB = getDatabase();
		users = users.filter((user) => user.userId !== userId);
		writeDatabase(users);
	}

	static createUser(newUser: User): void {
		const users: DB = getDatabase();
		users.push(newUser);
		writeDatabase(users);
	}

	static existsUser(email: string, password: string): boolean {
		const users = getDatabase();
		const user = users.find((user) => user.email === email);
		return Boolean(user && user.password === password);
	}

	static getUsers(): User[] {
		return getDatabase();
	}

	/*
        CHATS
    */
	static getUserChats(userId: id): Chat[] | undefined {
		const users = getDatabase();
		const requestedUser = users.find((user) => user.userId === userId);
		return requestedUser?.chats;
	}

	static getUserChat(userId: id, chatId: id): Chat | undefined {
		const users = getDatabase();
		const requestedUser = users.find((user) => user.userId === userId);
		return requestedUser?.chats.find((chat) => chat.chatId === chatId);
	}

	static createChat(userId: id, chat: Chat): void {
		const users = getDatabase();
		users.map((user) => {
			if (user.userId === userId) {
				user.chats.push(chat);
			}
			return user;
		});
		writeDatabase(users);
	}

	static deleteChat(userId: id, chatId: id): void {
		let users: DB = getDatabase();
		users = users.map((user) => {
			if (user.userId === userId) {
				user.chats = user.chats.filter((chat) => chat.chatId !== chatId);
			}
			return user;
		});
		writeDatabase(users);
	}

	static sendMessage(userId: id, chatId: id, message: Message): void {
		let users: DB = getDatabase();
		users.map((user) => {
			if (user.userId === userId) {
				user.chats = user.chats.map((chat) => {
					if (chat.chatId === chatId) {
						chat.messages.push(message);
					}
					return chat;
				});
			}
			return user;
		});
		writeDatabase(users);
	}
}
