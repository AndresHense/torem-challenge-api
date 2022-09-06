import { Server } from 'socket.io';

let io: ServerType;

export function init(httpServer: any) {
	io = new Server<
		ClientToServerEvents,
		ServerToClientEvents,
		InterServerEvents,
		SocketData
	>(httpServer, {
		// @ts-ignore
		method: 'GET'
	});
	return io;
}

export function getIO(): ServerType {
	if (!io) {
		throw new Error('Socket IO not defined!');
	}
	return io;
}
