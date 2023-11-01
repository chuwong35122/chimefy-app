<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { spaceMemberStore, spaceRoleStore, spaceStore } from '$stores/space/index';
	import TrackSearchTab from '$components/space/track/TrackSearchTab.svelte';
	import TrackQueueList from '$components/space/queue/TrackQueueList.svelte';
	import MusicPlayerController from '$components/space/player/MusicPlayerController.svelte';
	import SpaceInfo from '$components/space/info/SpaceInfo.svelte';
	import { userConfigStore, userStore } from '$stores/auth/user';
	import seo from '$constants/seo';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import { Drawer, Modal } from 'flowbite-svelte';
	import SpaceHelpModal from '$components/modals/SpaceHelpModal.svelte';
	import SpaceMembers from '$components/space/members/SpaceMembers.svelte';
	import { sineIn } from 'svelte/easing';
	import Icon from '@iconify/svelte';
	import type { SpaceMember } from '$lib/types/space/member.interface.js';
	import { orderSpaceMembers } from '$utils/session/members';

	export let data;
	$: ({ space, url, supabase } = data);

	let openTutorialModal = false;

	$: if ($userStore?.id && space?.created_by) {
		spaceRoleStore.set(
			space?.created_by?.toString() === $userStore?.id.toString() ? 'admin' : 'member'
		);
	}

	let spaceChannel: RealtimeChannel;
	let memberChannel: RealtimeChannel;

	let hidden = true;

	onMount(() => {
		spaceStore.set(space);

		spaceChannel = supabase
			.channel(`space_listener_${space.uuid}`)
			.on('postgres_changes', { event: '*', schema: 'public', table: 'space' }, (payload) => {
				const _payload = payload.new as any;
				spaceStore.update((space) => {
					return {
						...space,
						queues: _payload.queues
					};
				});
			})
			.subscribe();

		memberChannel = supabase
			.channel(`space_member_listener_${space.uuid}`, {
				config: {
					presence: {
						key: 'members'
					}
				}
			})
			.on('presence', { event: 'sync' }, () => {
				const state = memberChannel.presenceState();
				const ordered = orderSpaceMembers(state.members as any as SpaceMember[]);
				spaceMemberStore.set(ordered);
			})
			.on('presence', { event: 'join' }, ({ newPresences }) => {
				const newMembers = newPresences as any as SpaceMember[];
				let _spaceMembers = $spaceMemberStore;
				if (_spaceMembers) {
					_spaceMembers = [..._spaceMembers, ...newMembers];
				}
				const ordered = orderSpaceMembers(_spaceMembers);
				spaceMemberStore.set(ordered);
			})
			.subscribe(async (status) => {
				if (status === 'SUBSCRIBED') {
					await memberChannel.track({
						joined_since: new Date(),
						display_name: $userStore?.user_metadata?.name ?? 'Anonymous',
						member_user_id: $userStore?.id ?? '',
						is_admin: $spaceStore?.created_by === $userStore?.id,
						profile_img: $userStore?.user_metadata?.avatar_url
					} as SpaceMember);
				}
			});
	});

	onDestroy(() => {
		memberChannel?.unsubscribe();
	});
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="description" content="Listen together" />
	<meta
		name="keywords"
		content="chimefy, spotify, listen together, join space, public space, private space"
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content={`Join ${space?.name}`} />
	<meta property="og:description" content={seo.appDescription} />
	<meta property="og:image" content={seo.spaceInvite.image} />
	<meta property="og:url" content={url} />
	<meta property="og:type" content="website" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:title" content={`You have been invited to Chimefy: ${space?.name}`} />
	<meta name="twitter:description" content={seo.spaceInvite.description} />
	<meta name="twitter:card" content={seo.twitterCard} />
	<meta name="twitter:image" content={seo.spaceInvite.image} />
	<meta name="twitter:image:alt" content={`Join ${space?.name}`} />

	<title>{space?.name ? `Listening to ${space?.name}` : 'Loading...'}</title>
</svelte:head>

<Modal bind:open={openTutorialModal} size="lg" class="modal-glass">
	<SpaceHelpModal />
</Modal>

<Drawer
	placement="right"
	transitionType="fly"
	transitionParams={{
		x: 320,
		duration: 200,
		easing: sineIn
	}}
	bind:hidden
	id="member-sidebar"
>
	<div class="flex flex-row items-center justify-between text-center">
		<h4 class="text-xl font-semibold text-black">Space's Members</h4>
		<button
			on:click={() => (hidden = true)}
			class="text-dark-300 hover:text-dark-400 hover:scale-110 duration-150"
		>
			<Icon icon="mdi:close" />
		</button>
	</div>
	<SpaceMembers />
</Drawer>

<div>
	<div class="my-6">
		<SpaceInfo {supabase} {hidden} on:viewMember={(e) => (hidden = e.detail.hidden)} />
	</div>
	<div class="flex flex-col md:flex-row gap-4 w-full">
		<div class="bg-dark-500 rounded-xl h-full md:h-[560px] w-full md:w-[1000px] lg:w-[1200px] flex flex-col md:flex-row justify-between p-6">
			<div class="w-full md:w-96">
				<TrackSearchTab {supabase} />
			</div>
			<div class="w-[500px]">
				<p class="text-lg font-semibold">Queues</p>
				<TrackQueueList {supabase} />
			</div>
		</div>
	</div>
	<!-- <div class="w-full grid place-items-end my-2">
		<button
			on:click={() => (openTutorialModal = !openTutorialModal)}
			class="text-xs underline text-dark-300 hover:text-dark-200 duration-150">Need help?</button
		>
		
	</div> -->
	{#if $spaceStore && $spaceStore?.id && $userConfigStore}
		<div class="mt-4">
			<MusicPlayerController {supabase} spaceId={$spaceStore?.id} />
		</div>
	{/if}
</div>
