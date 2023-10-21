<script lang="ts">
	import type { MusicSession } from '$interfaces/session/session.interface';
	import { onMount } from 'svelte';
	import { currentSession, currentSessionRole, currentSessionQueue } from '$stores/session';
	import { spaceRoleStore, spaceStore } from '$stores/space/index';
	import TrackSearchTab from '$components/music/TrackSearchTab.svelte';
	import TrackQueueList from '$components/music/TrackQueueList.svelte';
	// import MusicPlayerController from '$components/music/MusicPlayerController.svelte';
	// import SessionMembers from '$components/music/members/SessionMembers.svelte';
	import SessionInfo from '$components/music/SessionInfo.svelte';
	import { userStore } from '$stores/auth/user';
	import type { MusicQueue, MusicSessionQueue } from '$interfaces/session/queue.interface';
	import seo from '$constants/seo';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import { Modal } from 'flowbite-svelte';
	import SessionHelpModal from '$components/modals/SessionHelpModal.svelte';
	import SpaceMembers from '$components/music/members/SpaceMembers.svelte';

	export let data;
	let { space, url, supabase } = data;

	let openTutorialModal = false;

	let sessionId: string;
	let playerVolume = 50;
	let channel: RealtimeChannel;

	$: if ($userStore?.id && $currentSession?.created_by) {
		// TODO: remove
		currentSessionRole.set(
			$currentSession?.created_by.toString() === $userStore?.id.toString() ? 'admin' : 'member'
		);
		spaceRoleStore.set(
			$currentSession?.created_by.toString() === $userStore?.id.toString() ? 'admin' : 'member'
		);
	}

	onMount(() => {
		spaceStore.set(space);
		// currentSession.set(session as MusicSession);
		// sessionId = session?.uuid ?? '';
		// currentSessionQueue.set(queues as MusicSessionQueue);

		// const storedVolume = localStorage.getItem('player_volume');
		// if (storedVolume) {
		// 	playerVolume = Number(storedVolume);
		// }

		console.log(space.uuid);
		channel = supabase
			.channel(`session_listener_${space.uuid}`)
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'session' },
				(payload) => {
					const _payload = payload.new as any
					spaceStore.update((space) => {
						return {
							...space,
							queues: _payload.queues,
						}
					});
					
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

<div class="w-[400px] md:w-[640px] lg:w-[1000px] lg:h-[640px]">
	<div class="mt-8">
		<SessionInfo {supabase} />
	</div>
	{#if $userStore}
		<div class="bg-[rgba(255,255,255,0.05)] rounded-xl">
			<div class="flex flex-col lg:flex-row w-full">
				<TrackSearchTab {supabase} />
				<div class="w-full">
					<div class="w-full grid place-items-center my-2 mt-8">
						<p class="text-2xl font-semibold">Queues</p>
					</div>
					<div class="w-full h-[592px] overflow-y-auto">
						<TrackQueueList {supabase} />
					</div>
				</div>
			</div>
		</div>
		<div class="w-full grid place-items-end my-2">
			<button
				on:click={() => (openTutorialModal = !openTutorialModal)}
				class="text-xs underline text-dark-300 hover:text-dark-200 duration-150">Need help?</button
			>
		</div>
		{#if $spaceStore && $spaceStore?.id}
			<div class="h-24">
				<!-- <MusicPlayerController sessionId={$currentSession?.id} volume={playerVolume} /> -->
				<SpaceMembers {supabase} id={$spaceStore?.id} />
			</div>
		{/if}
	{/if}
</div>
