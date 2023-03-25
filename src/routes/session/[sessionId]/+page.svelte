<script lang="ts">
	import type {
		MusicSession,
		SessionJoinRequest,
		SessionJoinResponse
	} from '$lib/interfaces/session/session.interface';
	import { toastValue } from '$lib/notification/toast';
	import { pb, user } from '$lib/pocketbase/pb';
	import type { Record } from 'pocketbase';
	import { onDestroy, onMount } from 'svelte';
	import TrackSearchTab from '../../../component/music/TrackSearchTab.svelte';
	import { socket } from '$lib/socket/client';
	import {
		checkSessionRole,
		currentSession,
		currentSessionPassword,
		currentSessionRole,
		playingInfo,
		socketId
	} from '$lib/session/session';
	import TrackQueueList from '../../../component/music/TrackQueueList.svelte';
	import { spotifyUser } from '$lib/spotify/spotify';
	import MusicPlayerController from '../../../component/music/MusicPlayerController.svelte';
	import SessionQueueMembers from '../../../component/music/SessionQueueMembers.svelte';
	import SessionInfo from '../../../component/music/SessionInfo.svelte';

	// TODO: Store session password and check before entering
	export let data: { session: MusicSession & Record };

	$: if (data && data.session) {
		currentSession.set(data.session);
	}

	let sessionId = data.session.id;

	onMount(async () => {
		// const { isPrivate, password } = $currentSession;
		// const hasCorrectPassword = $currentSessionPassword === password;
		// if (!$currentSession || !isPrivate || !hasCorrectPassword) {
		// 	goto('/session');
		// 	toastValue.set({ message: "You need session's password", type: 'warn' });
		// }
		if (!sessionId || !$user || !$user?.id || !$spotifyUser) return;

		const socketConnection = socket.connect();

		// Admin: send current playing track to new comers
		const joinSessionRequest: SessionJoinRequest = {
			sessionId: sessionId,
			socketId: socketConnection.id,
			userId: $user?.id,
			spotifyDisplayName: $spotifyUser.display_name ?? '',
			playingInfo: $playingInfo
		};

		// Connect to Music session and request for its states
		socket.on('connect', () => {
			socketId.set(socketConnection.id);
			socket.emit('joinSession', joinSessionRequest);
		});

		socket.on('onNewComerJoin', (joinResponse: SessionJoinResponse) => {
			toastValue.set({ message: `Say hi to ${joinResponse.spotifyDisplayName} 👋`, type: 'info' });
			const sessionRole = checkSessionRole($user?.id, $currentSession);
			currentSessionRole.set(sessionRole);

			if (sessionRole === 'member') {
				playingInfo.set(joinResponse.playingInfo);
				const _session = $currentSession;
				_session.participants.push({
					userId: $user?.id ?? '',
					role: sessionRole,
					profileImg: $spotifyUser?.images && $spotifyUser.images[0].url,
					spotifyDisplayedName: $spotifyUser?.display_name ?? ''
				});
				pb.collection('sessions').update($currentSession?.id, _session);
			}
		});

		pb.collection('sessions').subscribe(sessionId, async () => {
			const session = await pb.collection('sessions').getOne<MusicSession & Record>(sessionId);
			currentSession.set(session);
		});
	});

	onDestroy(() => {
		pb.collection('sessions').unsubscribe();
		socket.removeAllListeners();
	});
</script>

<svelte:head>
	<title>Session - {$currentSession.name}</title>
	<script src="https://sdk.scdn.co/spotify-player.js"></script>
</svelte:head>
<div class="p-4 w-[400px] md:w-[640px] lg:w-[1000px]">
	<SessionInfo {sessionId} />
</div>
<div class="w-[400px] md:w-[640px] lg:w-[1000px] lg:h-[640px] bg-[rgba(255,255,255,0.05)] rounded-xl">
	<div class="flex flex-col lg:flex-row w-full">
		<TrackSearchTab />
		<div class="w-full">
			<div class="w-full grid place-items-center my-2">
				<p class="text-2xl font-semibold">
					Queues
				</p>
			</div>
			<div class="w-full h-[592px] overflow-y-auto">
				<TrackQueueList />
			</div>
		</div>
	</div>
</div>
<div class="w-[400px] md:w-[640px] lg:w-[1000px] h-24 mt-6">
	<MusicPlayerController />
	<SessionQueueMembers />
</div>
