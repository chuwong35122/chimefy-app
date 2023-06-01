<script lang="ts">
	import { currentSession, playingInfo } from '$lib/session/session';
	import { ioClient } from '$lib/socket/client';
	import { onDestroy, onMount } from 'svelte';
	import { userStore } from '$lib/supabase/user';
	import type {
		SocketJoinSessionRoom,
		SocketPlayerBroadcastInfo
	} from '$lib/interfaces/spotify/broadcast.interface';
	import type { SessionPlayingInfo } from '$lib/interfaces/session/session.interface';
	import { Alert } from 'flowbite-svelte';

	let interval: NodeJS.Timer;
	let socketConnection = ioClient.connect();

	let isConnected = false;

	// send data to the server to join room and prepare to send broadcast data
	function onConnect() {
		isConnected = socketConnection.connected;

		const joinPayload: SocketJoinSessionRoom = {
			session_uuid: $currentSession?.uuid,
			user_id: $userStore?.id,
			session_name: $currentSession?.name,
			display_name: $userStore?.user_metadata?.name ?? ''
		};

		if (joinPayload.session_uuid && joinPayload.user_id) {
			console.log(joinPayload)
			socketConnection.emit('join_session_room', joinPayload);
		}

		interval = setInterval(() => {
			const playerInfoBroadcastPayload: SocketPlayerBroadcastInfo = {
				playing_info: $playingInfo,
				session_uuid: $currentSession?.uuid ?? null
			};

			if (playerInfoBroadcastPayload?.playing_info && playerInfoBroadcastPayload?.session_uuid) {
				console.log(playerInfoBroadcastPayload)
				socketConnection.emit('player_info_broadcast', playerInfoBroadcastPayload);
			}
		}, 1000);
	}

	function onDisconnect() {
		isConnected = false;
	}

	onMount(() => {

		isConnected = socketConnection.connected
		socketConnection.on('connect', onConnect);

		// socketConnection.on('disconnect', onDisconnect);

		socketConnection.on('join_session_room_response', (message: string) => {
			console.log(message);
		});

		socketConnection.on('player_info_broadcast_response', (message: string) => {
			console.log('cat');
		});
	});

	onDestroy(() => {
		console.log('Destroying admin socket connection');
		socketConnection.disconnect();
		socketConnection.removeAllListeners()
		if (interval) clearInterval(interval);
	});
</script>

<div>
	<button on:click={() => {
		socketConnection.emit('uwu')
	}}>
		Click me
	</button>
	{#if isConnected}
	<div>I am an admin</div>
		<!-- <Alert color="dark">
			<span class="font-medium">Connected!</span> Wait for the admin to play music...
		</Alert>
	{:else}
		<Alert color="red">
			<span class="font-medium">Cannot Connect!</span>Try refreshing the page!
		</Alert> -->
	{/if}
</div>
