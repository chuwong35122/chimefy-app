<script lang="ts">
	import { currentSession } from '$lib/session/session';
	import { ioClient } from '$lib/socket/client';
	import { onDestroy, onMount } from 'svelte';
	import type { SessionJoinRequest } from '$lib/interfaces/session/socket.interface';

	// 1. start broadcast
	// 2

	const socketConnection = ioClient.connect();
	onMount(() => {
		// create socket connection
		socketConnection.on('connect', () => {
			console.log('Connected to SocketIO');
		});

		socketConnection.on('onNewComerJoin', (payload: SessionJoinRequest) => {
			console.log(`A wild ${payload?.spotifyDisplayName} has appeard`);
		});

		socketConnection.on('disconnect', () => {
			// close session socket and document in database
		});
	});

	onDestroy(() => {
		socketConnection.disconnect();
	});
</script>
