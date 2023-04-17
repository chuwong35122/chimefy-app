<script lang="ts">

	import { ioClient } from '$lib/socket/client';
	import { onDestroy, onMount } from 'svelte';
	import {currentSession, currentSessionRole, memberSessionInitProcess} from '$lib/session/session';
	import { spotifyUser } from '$lib/spotify/spotify';
	import type { SessionJoinRequest } from '$lib/interfaces/session/session.interface';
	import type { JoinSessionRequest } from '$lib/interfaces/session/socket.interface';

	const socketConnection = ioClient.connect();
	onMount(() => {
		console.log($currentSession)
		console.log($spotifyUser)
		memberSessionInitProcess.update(val => ['session_init', ...val])

		// create socket connection
		socketConnection.on('connect', () => {
			const payload: JoinSessionRequest = {
				sessionId: $currentSession.id,
				spotifyId: $spotifyUser?.id ?? '',
				spotifyDisplayName: $spotifyUser?.display_name ?? 'anonymous'
			}
			
			socketConnection.emit('joinSession', payload);
			memberSessionInitProcess.update(val => ['socket_start_success', ...val])
		});

		socketConnection.on('onNewComerJoin', (payload: SessionJoinRequest) => {
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
