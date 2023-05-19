<script lang="ts">
	import type { MusicSession } from '$lib/interfaces/session/session.interface';
	import { onDestroy, onMount } from 'svelte';
	import TrackSearchTab from '$lib/components/music/TrackSearchTab.svelte';
	import { currentSession, currentSessionRole, addSessionParticipant } from '$lib/session/session';
	import TrackQueueList from '$lib/components/music/TrackQueueList.svelte';
	import { spotifyAccessToken, spotifyUser } from '$lib/spotify/spotify';
	import MusicPlayerController from '$lib/components/music/MusicPlayerController.svelte';
	import SessionQueueMembers from '$lib/components/music/SessionQueueMembers.svelte';
	import SessionInfo from '$lib/components/music/SessionInfo.svelte';
	import { ioClient } from '$lib/socket/client';
	import SocketListener from '$lib/components/io/SocketListener.svelte';
	import AdminSocketHandler from '$lib/components/io/AdminSocketHandler.svelte';
	import { supabase } from '$lib/supabase/supabase';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import { userStore } from '$lib/supabase/user';

	// TODO: Store session password and check before entering
	export let data: {session: MusicSession}
	let {session} = data

	let sessionId: string;
	let sessionChannel: RealtimeChannel;

	// onMount(async () => {
	// 	sessionChannel = supabase
	// 		.channel('session_queues_listener')
	// 		.on(
	// 			'postgres_changes',
	// 			{ event: 'UPDATE', schema: 'public', table: 'session' },
	// 			(payload) => {
	// 				currentSession.set(payload.new as MusicSession)
	// 			}
	// 		)
	// 		.subscribe();
	// });

	onMount(async () => {
		currentSession.set(session as MusicSession)
		sessionId = session?.uuid ?? ''
		currentSessionRole.set($currentSession.created_by.id === $userStore?.user_metadata?.uuid ? 'admin' : 'member')

		if($currentSessionRole === 'member') {
			// addSessionParticipant($currentSession, $userStore?.id, $spotifyUser)
		}
	})

	// onDestroy(async () => {
	// 	// await supabase.removeChannel(sessionChannel);
	// 	ioClient.removeAllListeners();
	// });
</script>

<svelte:head>
	<title>Listening to {$currentSession?.name}</title>
</svelte:head>

<!-- {#if $currentSessionRole === 'admin' && $userStore && $currentSession}
	<AdminSocketHandler />
{:else if $currentSessionRole === 'member' && $userStore && $currentSession}
	<SocketListener />
{/if} -->
<div class="p-4 w-[400px] md:w-[640px] lg:w-[1000px]">
	<SessionInfo {sessionId} />
</div>

{#if $userStore?.user_metadata?.uuid}
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
					<!-- <TrackQueueList /> -->
				</div>
			</div>
		</div>
	</div>
	<div class="w-[400px] md:w-[640px] lg:w-[1000px] h-24 mt-6">
		<!-- <MusicPlayerController /> -->
		<!-- <SessionQueueMembers /> -->
	</div>
{/if}
