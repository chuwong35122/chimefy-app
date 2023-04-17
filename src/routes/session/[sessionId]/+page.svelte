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
	import TrackSearchTab from '$lib/components/music/TrackSearchTab.svelte';
	import { socket } from '$lib/socket/client';
	import {
		checkSessionRole,
		currentSession,
		currentSessionRole,
		increamentInitializationProcess,
		playingInfo,
		adminSessionInitProcess,
		socketId,
		sessionInitModalOpen,
		memberSessionInitProcess
	} from '$lib/session/session';
	import TrackQueueList from '$lib/components/music/TrackQueueList.svelte';
	import { spotifyAccessToken, spotifyUser } from '$lib/spotify/spotify';
	import MusicPlayerController from '$lib/components/music/MusicPlayerController.svelte';
	import SessionQueueMembers from '$lib/components/music/SessionQueueMembers.svelte';
	import SessionInfo from '$lib/components/music/SessionInfo.svelte';
	import { Modal } from 'flowbite-svelte';
	import SessionInitializeProcessModal from '$lib/components/modals/SessionInitializeProcessModal.svelte';
	import { wait } from '$lib/utils/common/time';

	// TODO: Store session password and check before entering
	export let data: { session: MusicSession & Record };

	$: if (data && data.session) {
		currentSession.set(data.session);
	}

	let sessionId = data.session.id;

	adminSessionInitProcess.subscribe((val) => {
		if($currentSessionRole !== 'admin') return

		if(val === 3) {
			setTimeout(() => {
				sessionInitModalOpen.set(false)
			}, 1000)
		}
		else sessionInitModalOpen.set(true)
	})

	memberSessionInitProcess.subscribe((val) => {
		if($currentSessionRole !== 'member') return

		if(val === 4) {
			setTimeout(() => {
				sessionInitModalOpen.set(false)
			}, 1000)
		}
		else sessionInitModalOpen.set(true)
	})

	onMount(async () => {
		// TODO: add hashed password in query params

		// const { isPrivate, password } = $currentSession;
		// const hasCorrectPassword = $currentSessionPassword === password;
		// if (!$currentSession || !isPrivate || !hasCorrectPassword) {
		// 	goto('/session');
		// 	toastValue.set({ message: "You need session's password", type: 'warn' });
		// }
		await wait(2000)
		if (!sessionId || !$user || !$user?.id || !$spotifyUser) return;
	
		const socketConnection = socket.connect();
		console.log('3')
		increamentInitializationProcess($currentSessionRole)
		// Admin: send current playing track to new comers
		
		const joinSessionRequest: SessionJoinRequest = {
			sessionId: sessionId,
			socketId: socketConnection.id,
			userId: $user?.id,
			spotifyDisplayName: $spotifyUser.display_name ?? '',
			playingInfo: $playingInfo
		};
		
		// Connect to Music session and request for its states (not participants)
		socket.on('connect', async () => {
			socketId.set(socketConnection.id);
			socket.emit('joinSession', joinSessionRequest);
			console.log('4')
			increamentInitializationProcess($currentSessionRole)
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
	});

	onDestroy(() => {
		pb.collection('sessions').unsubscribe();
		socket.removeAllListeners();
	});
</script>

<svelte:head>
	<title>Listening to {$currentSession.name}</title>
</svelte:head>

<Modal open={$sessionInitModalOpen} size="lg" class="modal-glass">
	<SessionInitializeProcessModal />
</Modal>
<div class="p-4 w-[400px] md:w-[640px] lg:w-[1000px]">
	<SessionInfo {sessionId} />
</div>
{#if $spotifyAccessToken}
	<div
		class="w-[400px] md:w-[640px] lg:w-[1000px] lg:h-[640px] bg-[rgba(255,255,255,0.05)] rounded-xl"
	>
		<div class="flex flex-col lg:flex-row w-full">
			<TrackSearchTab />
			<div class="w-full">
				<div class="w-full grid place-items-center my-2">
					<p class="text-2xl font-semibold">Queues</p>
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
{/if}
