<script lang="ts">
	import type { MusicSession } from '$lib/interfaces/session/session.interface';
	import { onMount } from 'svelte';
	import TrackSearchTab from '$lib/components/music/TrackSearchTab.svelte';
	import { currentSession, currentSessionRole, currentSessionQueue } from '$lib/session/session';
	import TrackQueueList from '$lib/components/music/TrackQueueList.svelte';
	import MusicPlayerController from '$lib/components/music/MusicPlayerController.svelte';
	import SessionQueueMembers from '$lib/components/music/members/SessionQueueMembers.svelte';
	import SessionInfo from '$lib/components/music/SessionInfo.svelte';
	import { supabase } from '$lib/supabase/supabase';
	import { userStore } from '$lib/supabase/user';
	import type { MusicSessionQueue } from '$lib/interfaces/session/queue.interface';

	export let data: { session: MusicSession; queues: MusicSessionQueue };
	let { session, queues } = data;

	let sessionId: string;

	$: if ($userStore?.id && $currentSession?.created_by) {
		currentSessionRole.set(
			$currentSession?.created_by.toString() === $userStore?.id.toString() ? 'admin' : 'member'
		);
	}

	onMount(() => {
		currentSession.set(session as MusicSession);
		sessionId = session?.uuid ?? '';
		currentSessionQueue.set(queues as MusicSessionQueue);

		supabase
			.channel(`session_queue_listener_${sessionId}`)
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'session_queue' },
				(payload) => {
					currentSessionQueue.set(payload.new as MusicSessionQueue);
				}
			)
			.subscribe();
	});
</script>

<svelte:head>
	<title>{$currentSession?.name ? `Listening to ${$currentSession?.name}` : 'Loading...'}</title>
</svelte:head>

<div class="p-4 w-[400px] md:w-[640px] lg:w-[1000px]">
	<SessionInfo {sessionId} />
</div>

{#if $userStore}
	<div
		class="w-[400px] md:w-[640px] lg:w-[1000px] lg:h-[640px] bg-[rgba(255,255,255,0.05)] rounded-xl"
	>
		<div class="flex flex-col lg:flex-row w-full">
			<TrackSearchTab />
			<div class="w-full">
				<div class="w-full grid place-items-center my-2 mt-8">
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
