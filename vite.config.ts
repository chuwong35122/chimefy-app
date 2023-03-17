import { webSocketServer } from './src/lib/socket/socket.config';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), webSocketServer]
});
