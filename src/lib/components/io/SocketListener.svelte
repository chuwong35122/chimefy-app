<script lang="ts">
	import type { SessionPlayingInfo } from '$lib/interfaces/session/session.interface';
	import type { SocketJoinSessionRoom } from '$lib/interfaces/spotify/broadcast.interface';
	import { currentSession } from '$lib/session/session';
	import { ioClient } from '$lib/socket/client';
	import { userStore } from '$lib/supabase/user';
	import { onDestroy, onMount } from 'svelte';

	const socketConnection = ioClient.connect();
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

			socketConnection.on('join_session_room_response', (message: string) => {
				console.log(message);
			});

			socketConnection.on('player_info_broadcast_response', (data: SessionPlayingInfo) => {
				console.log(data);
			});
		});

		socketConnection.on('disconnect', () => {
			// close session socket and document in database
		});
	});

	onDestroy(() => {
		socketConnection.disconnect();
	});
</script>
