import type {
	InitRoomRequest,
	JoinSessionRequest,
	SessionBoardcastRequest
} from '$lib/interfaces/session/socket.interface';
import { Server } from 'socket.io';

export default function injectSocketIO(server: any) {
	const io = new Server(server, {
		cors: {
			origin: '*'
		}
	});

	io.on('connection', (socket) => {
		console.log(socket.id);

		socket.on('createSession', (payload: InitRoomRequest) => {
			socket.join(payload.sessionId);
			socket.emit('onSessionCreated'); // emit to that user only
		});

		socket.on('joinSession', (payload: JoinSessionRequest) => {
			socket.join(payload.sessionId);
			console.log({ payload });
			io.emit('onNewComerJoin', payload); // show session join notification
		});

		socket.on('startSessionBroadcast', (payload: SessionBoardcastRequest) => {
			io.to(payload.sessionId).emit('onStartBoardcast', payload);
		});
	});
}
