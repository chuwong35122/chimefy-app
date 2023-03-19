import type { SessionJoinRequest } from '$lib/interfaces/session.interface';
import { Server } from 'socket.io';
import type { Track } from 'spotify-types';

export default function injectSocketIO(server: any) {
	const io = new Server(server);

	io.on('connection', (socket) => {
		socket.on('joinSession', async (joinRequest: SessionJoinRequest) => {
			const { sessionId, userId, socketId, spotifyDisplayName } = joinRequest;
			console.log(joinRequest);
			socket.emit('onNewComerJoin', `Say hi to ${spotifyDisplayName}`);
		});

		socket.on('message', (message) => {
			socket.to(socket.id).emit('');
		});

		socket.on('addQueue', (track: Track) => {
			console.log(track.id);
		});

		socket.on('disconnect', () => {
			// send notification
		});
	});
	console.log('SocketIO injected');
}
