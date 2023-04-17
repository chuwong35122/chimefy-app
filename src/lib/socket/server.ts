import type { SessionJoinRequest } from '$lib/interfaces/session/session.interface';
import type { InitRoomRequest } from '$lib/interfaces/session/socket.interface';
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

		socket.on('joinSession', (payload: SessionJoinRequest) => {
			socket.join(payload.sessionId);
			console.log({ payload });
			io.emit('onNewComerJoin', payload); // show session join notification
		});
	});
}
