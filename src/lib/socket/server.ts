import { Server } from 'socket.io';
import type {
	SocketJoinSessionRoom,
	SocketPlayerBroadcastInfo
} from '$lib/interfaces/spotify/broadcast.interface';

export default function injectSocketIO(server: any) {
	const io = new Server(server, {
		cors: {
			origin: '*'
		}
	});

	io.on('connection', (socket) => {
		console.log(socket.id);
		socket.on('disconnect', () => {});
		// Join session room
		socket.on('join_session_room', (data: SocketJoinSessionRoom) => {
			socket.join(data.session_uuid);
			socket.emit(
				'join_session_room_response',
				`User ${data?.display_name} has joined session ${data?.session_name}.`
			);
		});

		// Periodically broadcast the current player state to all connected clients
		socket.on('player_info_broadcast', (data: SocketPlayerBroadcastInfo) => {
			if (data?.session_uuid) {
				socket.to(data?.session_uuid).emit('player_info_broadcast_response', data.playing_info);
			}
		});
	});
}
