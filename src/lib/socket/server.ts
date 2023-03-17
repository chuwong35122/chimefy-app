import { Server } from 'socket.io';
import type { Track } from 'spotify-types';

export default function injectSocketIO(server: any) {
	const io = new Server(server);

	io.on('connection', (socket) => {
		let username = `User ${Math.round(Math.random() * 999999)}`;
		socket.emit('name', username);

		socket.on('message', (message) => {});

		socket.on('addQueue', (track: Track) => {
			console.log(track.id);
		});
	});
	console.log('SocketIO injected');
}
