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

	const socketConnection = ioClient.connect();
	let interval: NodeJS.Timer;

	onMount(() => {
		socketConnection.on('connect', () => {
			console.log('Connected to Socket.io server!');

			if (!$currentSession?.uuid || !$userStore?.id) return;

			const joinSessionRoomPayload: SocketJoinSessionRoom = {
				session_uuid: $currentSession.uuid,
				user_id: $userStore.id,
				session_name: $currentSession.name,
				display_name: $userStore?.user_metadata?.display_name ?? ''
			};

			socketConnection.emit('join_session_room', joinSessionRoomPayload);

			interval = setInterval(() => {
				const playerInfoBroadcastPayload: SocketPlayerBroadcastInfo = {
					playing_info: $playingInfo,
					session_uuid: $currentSession?.uuid ?? null
				};

				if(playerInfoBroadcastPayload?.playing_info && playerInfoBroadcastPayload?.session_uuid) {
					socketConnection.emit('player_info_broadcast', playerInfoBroadcastPayload);
				}
			}, 1000);
		});
	});

	socketConnection.on('disconnect', () => {
		console.log('Disconnected!')
	})

	onDestroy(() => {
		socketConnection.disconnect();
		if(interval) {
			clearInterval(interval)
		}
	});
</script>
