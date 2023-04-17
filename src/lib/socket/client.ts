import { PUBLIC_SOCKET_IO_CLIENT_URL } from '$env/static/public';
import io from 'socket.io-client';

const socket = io(PUBLIC_SOCKET_IO_CLIENT_URL);
export const ioClient = socket;
