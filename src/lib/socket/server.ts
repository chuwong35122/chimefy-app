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

	// FIXME: Bug.
	// Session broadcast does not work with member.

	io.on('connection', (socket) => {
		socket.on('disconnect', () => {});

		// Join session room
		socket.on('join_session_room', (data: SocketJoinSessionRoom) => {
			console.log(data);

			if (data?.session_uuid) {
				socket.emit(
					'join_session_room_response',
					`User ${data?.display_name} has joined session ${data?.session_name}.`
				);
			}

			// Periodically broadcast the current player state to all connected clients
			socket.on('player_info_broadcast', (data: SocketPlayerBroadcastInfo) => {
				console.log(data);
				if (data?.session_uuid) {
					console.log('emitting');
					socket.emit('player_info_broadcast_response', data?.playing_info);
				}
			});
		});
	});
}
