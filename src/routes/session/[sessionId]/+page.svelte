<script lang="ts">
	import type {
		MusicSession,
		SessionJoinRequest,
		SessionJoinResponse
	} from '$lib/interfaces/session/session.interface';
	import { toastValue } from '$lib/notification/toast';
	import { pb, user } from '$lib/pocketbase/pb';
	import Icon from '@iconify/svelte';
	import { Tooltip } from 'flowbite-svelte';
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

	// TODO: Store session password and check before entering
	export let data: { session: MusicSession & Record };

	$: if (data && data.session) {
		currentSession.set(data.session);
	}

	let sessionId = data.session.id;

	function onCopySessionId() {
		toastValue.set({ message: "Session's ID copied!", type: 'info' });
		navigator.clipboard.writeText(sessionId);
	}

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
			currentSessionRole.set(sessionRole)
			
			if (sessionRole === 'member') {
				playingInfo.set(joinResponse.playingInfo);
				const _session = $currentSession;
				_session.participants.push({
					userId: $user?.id ?? '',
					role: sessionRole,
					socketId: socketConnection.id,
					profileImg: $spotifyUser?.images && $spotifyUser.images[0].url
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
		pb.collection('sessions').unsubscribe()
		socket.removeAllListeners();
	});
</script>

<div class="w-[1000px] h-[640px] p-6 bg-[rgba(255,255,255,0.05)] rounded-xl">
	<Tooltip triggeredBy="[id=copy-id-btn]">Copy Session's ID</Tooltip>
	<div class="flex flex-row justify-between items-emd w-full">
		<Tooltip triggeredBy="[id='isPrivate-icon']"
			>{$currentSession?.isPrivate
				? 'This session is a private session'
				: 'This session is a public session'}</Tooltip
		>
		<div>
			<div class="flex flex-row items-center">
				<div id="isPrivate-icon" class="cursor-pointer">
					{#if $currentSession?.isPrivate}
						<Icon
							icon="material-symbols:lock"
							width="20"
							height="20"
							class="text-dark-400 hover:text-dark-300 duration-200"
						/>
					{:else}
						<Icon
							icon="material-symbols:lock-open-rounded"
							width="20"
							height="20"
							class="text-dark-400 hover:text-dark-300 duration-200"
						/>
					{/if}
				</div>
				<h1 class="text-2xl font-medium ml-2 mr-2">{$currentSession?.name}</h1>
				<div
					class="mt-2 px-1 bg-dark-300/60 rounded-full hover:bg-dark-300 duration-200 grid place-items-center cursor-default"
				>
					<span class="font-medium text-xs text-black">{$currentSession?.type}</span>
				</div>
			</div>
		</div>
		<button id="copy-id-btn" on:click={onCopySessionId} class="hover:scale-[1.1] duration-200">
			<Icon
				icon="material-symbols:content-copy"
				width={30}
				height={30}
				class="text-gray-500 hover:text-gray-300 duration-200"
			/>
		</button>
	</div>
	<div class="flex flex-row w-full h-full">
		<TrackSearchTab />
		<div class="w-full overflow-y-auto">
			<TrackQueueList />
		</div>
	</div>
</div>
<div class="w-[1000px] h-24 mt-6">
	<MusicPlayerController />
</div>
