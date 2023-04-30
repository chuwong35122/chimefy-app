<script lang="ts">
	import { ioClient } from '$lib/socket/client';
	import { onDestroy, onMount } from 'svelte';
	import {currentSession} from '$lib/session/session';
	import { spotifyUser } from '$lib/spotify/spotify';
	import type { JoinSessionRequest, SessionBoardcastRequest } from '$lib/interfaces/session/socket.interface';

	const socketConnection = ioClient.connect();
	onMount(() => {
		console.log($currentSession)
		console.log($spotifyUser)

		// create socket connection
		socketConnection.on('connect', () => {
			const payload: JoinSessionRequest = {
				sessionId: $currentSession.id,
				spotifyId: $spotifyUser?.id ?? '',
				spotifyDisplayName: $spotifyUser?.display_name ?? 'anonymous'
			}
			
			socketConnection.emit('joinSession', payload);
		});

		socketConnection.on('onNewComerJoin', (payload: JoinSessionRequest) => {
			console.log(payload)
			console.log(`A wild ${payload?.spotifyDisplayName} has appeard`)
		})

		socketConnection.on('disconnect', () => {
			// close session socket and document in database
		});
	});

	onDestroy(() => {
		socketConnection.disconnect()
	});
</script>
