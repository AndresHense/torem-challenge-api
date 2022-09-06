import uniqid from 'uniqid';

export type id = string;

export class User implements UserInterface {
	userId: id;
	name: string;
	lastName: string;
	email: string;
	password: string;
	image: string;
	chats: Chat[];

	constructor(
		name: string,
		lastName: string,
		email: string,
		password: string,
		image: string
	) {
		this.userId = uniqid();
		this.name = name;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.image = image;
		this.chats = [];
	}
}

export class Chat implements ChatInterface {
	chatId: id;
	name: string;
	image: string;
	messages: Message[];

	constructor(name: string, image: string) {
		this.chatId = uniqid();
		this.name = name;
		this.image = image;
		this.messages = [];
	}
}

export class Message implements MessageInterface {
	messageId: id;
	message: string;
	timeDate: string;
	received: boolean;

	constructor(message: string, received: boolean) {
		this.messageId = uniqid();
		this.message = message;
		this.timeDate = new Date().toISOString();
		this.received = received;
	}
}

export class StatusError extends Error {
	status: number;

	constructor(message: string, status?: number) {
		super(message);
		this.status = status || 500;
	}
}
