import { Server } from 'socket.io';

export default function injectSocketIO(server: any) {
	const io = new Server(server);

	io.on('connection', (socket) => {
		let username = `User ${Math.round(Math.random() * 999999)}`;
		socket.emit('name', username);

		socket.on('message', (message) => {});
	});

	console.log('SocketIO injected');
}
