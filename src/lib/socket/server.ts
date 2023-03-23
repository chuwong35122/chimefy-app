import type { SessionTrackQueueRequest } from '$lib/interfaces/session/queue.interface';
import type {
	OnChangePlayingInfoRequest,
	SessionJoinRequest,
	SessionJoinResponse
} from '$lib/interfaces/session/session.interface';
import { Server } from 'socket.io';

export default function injectSocketIO(server: any) {
	const io = new Server(server);

	io.on('connection', (socket) => {
		socket.on('joinSession', async (joinRequest: SessionJoinRequest) => {
			const { sessionId, spotifyDisplayName, playingInfo } = joinRequest;
			socket.join(sessionId);
			socket
				.to(sessionId)
				.emit('onNewComerJoin', { spotifyDisplayName, playingInfo } as SessionJoinResponse);
		});

		socket.on('addQueue', (queueRequest: SessionTrackQueueRequest) => {
			const { sessionId, track, spotifyDisplayName } = queueRequest;
			if (sessionId) {
				socket
					.to(sessionId)
					.emit('onQueueAdded', `${track?.trackName} has been added by ${spotifyDisplayName}`);
			}
		});

		socket.on('onChangePlayingInfo', (request: OnChangePlayingInfoRequest) => {
			console.log(request);
			socket.to(request.sessionId).emit('handleChangePlayingInfo', request.playingInfo);
		});

		socket.on('disconnect', () => {
			// send notification
		});
	});
	console.log('SocketIO injected');
}
