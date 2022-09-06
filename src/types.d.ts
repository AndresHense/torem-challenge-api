/*
	MODELS
*/

declare interface UserInterface {
	userId: id;
	name: string;
	lastName: string;
	email: string;
	password: string;
	image: string;
	chats: Chat[];
}

declare interface ChatInterface {
	chatId: id;
	name: string;
	image: string;
	messages: Message[];
}

declare interface MessageInterface {
	messageId: id;
	message: string;
	timeDate: string;
	received: boolean;
}

/*
	SOCKET.IO
*/

declare interface ServerToClientEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
}

declare interface ClientToServerEvents {
	hello: () => void;
}

declare interface InterServerEvents {
	ping: () => void;
}

declare interface SocketData {
	name: string;
	age: number;
}

declare type ServerType = Server<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>;

/*
	GRAPHQL	
*/
declare interface GraphqlError extends Error {
	originalError;
}
