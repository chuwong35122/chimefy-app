<script lang="ts">
	import type { MusicSession } from '$lib/types/session/session.interface.js';
	import { onMount } from 'svelte';
	import { currentSession, currentSessionRole, currentSessionQueue } from '$stores/session';
	import { spaceRoleStore, spaceStore } from '$stores/space/index';
	import TrackSearchTab from '$components/music/TrackSearchTab.svelte';
	import TrackQueueList from '$components/music/TrackQueueList.svelte';
	import MusicPlayerController from '$components/music/MusicPlayerController.svelte';
	// import SessionMembers from '$components/music/members/SessionMembers.svelte';
	import SessionInfo from '$components/music/SessionInfo.svelte';
	import { userConfigStore, userStore } from '$stores/auth/user';
	import type { MusicQueue, MusicSessionQueue } from '$lib/types/session/queue.interface.js';
	import seo from '$constants/seo';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import { Modal } from 'flowbite-svelte';
	import SessionHelpModal from '$components/modals/SessionHelpModal.svelte';
	import SpaceMembers from '$components/music/members/SpaceMembers.svelte';

	export let data;
	$: ({ space, configs, url, supabase } = data);

	let openTutorialModal = false;

	let sessionId: string;
	let channel: RealtimeChannel;

	$: if ($userStore?.id && space?.created_by) {
		spaceRoleStore.set(
			space?.created_by?.toString() === $userStore?.id.toString() ? 'admin' : 'member'
		);
	}

	onMount(() => {
		spaceStore.set(space);

		channel = supabase
			.channel(`session_listener_${space.uuid}`)
			.on('postgres_changes', { event: '*', schema: 'public', table: 'session' }, (payload) => {
				const _payload = payload.new as any;
				spaceStore.update((space) => {
					return {
						...space,
						queues: _payload.queues
					};
				});
			})
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
	<meta property="og:title" content={`Join ${space?.name}`} />
	<meta property="og:description" content={seo.appDescription} />
	<meta property="og:image" content={seo.sessionInvite.image} />
	<meta property="og:url" content={url} />
	<meta property="og:type" content="website" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:title" content={`You have been invited to Chimefy: ${space?.name}`} />
	<meta name="twitter:description" content={seo.sessionInvite.description} />
	<meta name="twitter:card" content={seo.twitterCard} />
	<meta name="twitter:image" content={seo.sessionInvite.image} />
	<meta name="twitter:image:alt" content={`Join ${space?.name}`} />

	<title>{space?.name ? `Listening to ${space?.name}` : 'Loading...'}</title>
</svelte:head>

<Modal bind:open={openTutorialModal} size="lg" class="modal-glass">
	<SessionHelpModal />
</Modal>
<div>
	<div class="mt-8 mb-2">
		<SessionInfo {supabase} />
	</div>
	<div class="flex flex-row gap-4 w-full p-2">
		<div class="bg-white/[0.05] rounded-xl h-full md:h-[600px] w-[1000px] flex flex-row">
			<div class="w-96">
				<TrackSearchTab {supabase} />
			</div>
			<div class="w-[500px]">
				<p class="text-2xl font-semibold">Queues</p>
				<TrackQueueList {supabase} />
			</div>
		</div>
	</div>
	<div>
		<!-- <div class="w-28 h-full md:h-[600px] bg-white/[0.05] rounded-xl">
			{#if $spaceStore?.id}
				<SpaceMembers {supabase} id={$spaceStore.id} />
			{/if}
		</div> -->
	</div>
	<!-- <div class="w-full grid place-items-end my-2">
		<button
			on:click={() => (openTutorialModal = !openTutorialModal)}
			class="text-xs underline text-dark-300 hover:text-dark-200 duration-150">Need help?</button
		>
		
	</div> -->
	{#if $spaceStore && $spaceStore?.id && configs}
		<div class="h-24">
			<MusicPlayerController {supabase} sessionId={$currentSession?.id} {configs} />
		</div>
	{/if}
</div>
