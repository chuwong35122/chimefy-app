<script lang="ts">
	import { ioClient } from '$lib/socket/client';
	import { onDestroy, onMount } from 'svelte';
	import type { JoinSessionRequest } from '$lib/interfaces/session/socket.interface';

	const socketConnection = ioClient.connect();
	onMount(() => {
		socketConnection.on('onNewComerJoin', (payload: JoinSessionRequest) => {
			console.log(payload);
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
