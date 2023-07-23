<script lang="ts">
	import type { MusicSession } from '$interfaces/session/session.interface';
	import { onMount } from 'svelte';
	import TrackSearchTab from '$components/music/TrackSearchTab.svelte';
	import { currentSession, currentSessionRole, currentSessionQueue } from '$stores/session';
	import TrackQueueList from '$components/music/TrackQueueList.svelte';
	import MusicPlayerController from '$components/music/MusicPlayerController.svelte';
	import SessionMembers from '$components/music/members/SessionMembers.svelte';
	import SessionInfo from '$components/music/SessionInfo.svelte';
	import { supabase } from '$supabase/supabase';
	import { userStore } from '$stores/auth/user';
	import type { MusicSessionQueue } from '$interfaces/session/queue.interface';
	import seo from '$constants/seo';

	export let data: { session: MusicSession; queues: MusicSessionQueue; url: string };
	let { session, queues, url } = data;

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
	<meta charset="UTF-8" />
	<meta name="description" content="Listen together" />
	<meta
		name="keywords"
		content="chimefy, spotify, listen together, join session, public session, private session"
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content={`Join ${session?.name}`} />
	<meta property="og:description" content={seo.appDescription} />
	<meta property="og:image" content={seo.sessionInvite.image} />
	<meta property="og:url" content={url} />
	<meta property="og:type" content="website" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:title" content={`You have been invited to Chimefy: ${session?.name}`} />
	<meta name="twitter:description" content={seo.sessionInvite.description} />
	<meta name="twitter:card" content={seo.twitterCard} />
	<meta name="twitter:image" content={seo.sessionInvite.image} />
	<meta name="twitter:image:alt" content={`Join ${session?.name}`} />

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
	{#if $currentSession && $currentSession?.id}
		<div class="w-[400px] md:w-[640px] lg:w-[1000px] h-24 mt-6">
			<MusicPlayerController sessionId={$currentSession?.id} />
			<SessionMembers sessionId={$currentSession?.id} />
		</div>
	{/if}
{/if}
