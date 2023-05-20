import type { SessionMember } from '$lib/interfaces/session/member.interface';
import type {
	JoinSessionRequest,
	PauseSessionBroadcastRequest,
	SessionBroadcastRequest
} from '$lib/interfaces/session/socket.interface';
import { Server } from 'socket.io';

export default function injectSocketIO(server: any) {
	const io = new Server(server, {
		cors: {
			origin: '*'
		}
	});

	io.on('connection', (socket) => {
		socket.on('disconnect', () => {});
	});
}
