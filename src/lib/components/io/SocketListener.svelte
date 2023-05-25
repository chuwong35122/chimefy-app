<script lang="ts">
	import type { SessionPlayingInfo } from '$lib/interfaces/session/session.interface';
	import type {
		SocketJoinSessionRoom,
		SocketPlayerBroadcastInfo
	} from '$lib/interfaces/spotify/broadcast.interface';
	import { currentSession, playingInfo } from '$lib/session/session';
	import { ioClient } from '$lib/socket/client';
	import { userStore } from '$lib/supabase/user';
	import { onDestroy, onMount } from 'svelte';

	let socketConnection = ioClient.connect();

	let isConnected = false;

	async function onConnect() {
		isConnected = socketConnection.connected;

		const joinPayload: SocketJoinSessionRoom = {
			session_uuid: $currentSession?.uuid,
			user_id: $userStore?.id,
			session_name: $currentSession?.name,
			display_name: $userStore?.user_metadata?.display_name ?? ''
		};

		console.log(joinPayload)
		if (joinPayload.session_uuid && joinPayload.user_id) {
			socketConnection.emit('join_session_room', joinPayload);
		}
	}

	function onDisconnect() {
		isConnected = false;
	}

	onMount(() => {
		isConnected = socketConnection.connected

		socketConnection.on('connect', async () => {
			await onConnect()
		});

		socketConnection.on('disconnect', onDisconnect);

		socketConnection.on('join_session_room_response', (message: string) => {
			console.log(message);
		});

		socketConnection.on('player_info_broadcast_response', (data: SocketPlayerBroadcastInfo) => {
			console.log('uwu')
			if (data?.playing_info) {
				playingInfo.set(data.playing_info);
			}
		});

		socketConnection.on('player_info_broadcast_response', (message: string) => {
			console.log('cat');
		});
	});


	// onDestroy(() => {
	// 	socketConnection.disconnect();
	// });
</script>