<script lang="ts">
	import type { TrackBroadcastPayload } from '$lib/types/space/broadcast.interface';
	import { toastValue } from '$stores/notification/toast';
	import { isPlayingStatus, playingDurationMs, playingInfo, playingTrackId } from '$stores/player';
	import Icon from '@iconify/svelte';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import { Tooltip } from 'flowbite-svelte';
	import { spaceRoleStore, spaceStore } from '$stores/space/index';
	import { onDestroy, onMount } from 'svelte';
	import qs from 'query-string';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let channel: RealtimeChannel;

	// Check for queues. If there are, trigger real-time channel broadcast to go forward.
	async function onSkipTrack() {
		if ($spaceRoleStore === 'member' && !$spaceStore?.allow_member_queue) {
			toastValue.set({ message: 'Admin does not allow members to skip track.', type: 'info' });
			return;
		}

		const queues = $spaceStore?.queues;
		const spaceId = $spaceStore?.id;

		if (queues && queues.length < 2) {
			toastValue.set({ message: 'Please add some tracks!', type: 'warn' });
			return;
		}

		toastValue.set({ message: 'Skipping track...', type: 'info' });
		playingDurationMs.set(0);

		if (queues && queues.length > 0 && spaceId && $playingInfo) {
			const payload: TrackBroadcastPayload = {
				isPlaying: $isPlayingStatus,
				playingTrackId: queues[1]?.id,
				currentDurationMs: 0
			};

			toastValue.set({
				message: 'Thank you, next 👉',
				type: 'info'
			});

			channel.send({
				type: 'broadcast',
				event: 'playerForward',
				payload
			});
		}
	}

	// Check for queues. If there are, trigger real-time channel broadcast to go back.
	async function onRestartTrack() {
		if ($spaceRoleStore === 'member' && !$spaceStore?.allow_member_queue) {
			toastValue.set({
				message: 'Admin does not allow members to go to replay track.',
				type: 'info'
			});
			return;
		}

		const queues = $spaceStore?.queues;
		if (queues && queues.length === 0) {
			toastValue.set({ message: 'Please add some tracks!', type: 'warn' });
			return;
		}

		if (!$isPlayingStatus) {
			toastValue.set({ message: 'Please play before going backward...', type: 'info' });
			return;
		}

		toastValue.set({ message: 'Going back...', type: 'info' });

		playingDurationMs.set(0);
		const payload: TrackBroadcastPayload = {
			isPlaying: $isPlayingStatus,
			playingTrackId: $playingTrackId,
			currentDurationMs: 0
		};

		toastValue.set({
			message: 'Going back... 🤞',
			type: 'info'
		});

		channel.send({
			type: 'broadcast',
			event: 'playerBackward',
			payload
		});
	}

	let broadcastTimer: NodeJS.Timer;

	function togglePlay() {
		toastValue.set({
			message: "Playing... Please wait ⏳",
			type: 'info'
		})
		onBroadcastSignal(true);
	}

	function togglePause() {
		toastValue.set({
			message: "Pausing... Please wait ⏳",
			type: 'info'
		})
		onBroadcastSignal(false);
	}

	// Send broadcast signal to other members with its playing info
	async function onBroadcastSignal(playing: boolean) {
		const queues = $spaceStore?.queues;
		if (queues && queues.length === 0) {
			toastValue.set({ message: 'Please add some tracks before playing!', type: 'warn' });
			return;
		}

		if (queues && queues[0]) {
			playingTrackId.set(queues[0]?.id);
		}

		clearTimeout(broadcastTimer);

		broadcastTimer = setInterval(() => {
			const payload: TrackBroadcastPayload = {
				isPlaying: playing,
				playingTrackId: $playingTrackId,
				currentDurationMs: $playingDurationMs
			};

			// Important: Do not change this 4,500ms delay. It is to make sure that the
			channel.send({
				type: 'broadcast',
				event: 'playerStart',
				payload
			});
		}, 4500);
	}

	// Check whether user just go redirected into this page to auto play previous track
	onMount(() => {
		const url = $page.url.href;
		const parsed = qs.parse(url);

		$page.url.searchParams.delete('isPlaying');
		$page.url.searchParams.delete('isAdmin');
		$page.url.searchParams.delete('positionMs');
		goto($page.url.href, {replaceState: false});

		if (parsed.isPlaying === 'true' && $spaceRoleStore === 'admin') {
			if (parsed.positionMs) {
				playingDurationMs.set(Number(parsed.positionMs));
			}

			togglePlay();
		}
	});

	onDestroy(() => {
		clearTimeout(broadcastTimer);
	})
</script>

<Tooltip triggeredBy="#back-button">
	{#if $spaceRoleStore === 'member' && !$spaceStore?.allow_member_queue}
		Admin does not allow going back to start
	{:else}
		Go to start
	{/if}
</Tooltip>

<Tooltip triggeredBy="#skip-button">
	{#if $spaceRoleStore === 'member' && !$spaceStore?.allow_member_queue}
		Admin does not allow skipping track
	{:else}
		Skip track
	{/if}
</Tooltip>

<Tooltip triggeredBy="#play-pause-button">
	{#if $spaceRoleStore === 'member'}
		Only admin can play/pause
	{:else}
		Play/Pause
	{/if}
</Tooltip>

<div id="controller-section" class="flex flex-row items-center mb-2">
	<button
		id="back-button"
		disabled={$spaceRoleStore === 'member' && !$spaceStore?.allow_member_queue}
		aria-disabled={$spaceRoleStore === 'member' && !$spaceStore?.allow_member_queue}
		aria-label="Go to previous track"
		on:click={onRestartTrack}
		class="disabled:text-dark-400"
	>
		<Icon
			icon="material-symbols:skip-previous-rounded"
			class="w-10 h-10 hover:scale-110 duration-100"
		/>
	</button>
	<button
		id="play-pause-button"
		disabled={$spaceRoleStore === 'member'}
		on:click={$isPlayingStatus ? togglePause : togglePlay}
		aria-disabled={$spaceRoleStore === 'member'}
		aria-label={$isPlayingStatus ? 'Pause track' : 'Play track'}
		class="disabled:text-dark-400"
	>
		{#if $isPlayingStatus}
			<Icon
				icon="material-symbols:pause-circle-rounded"
				class="w-10 h-10 hover:scale-110 duration-100"
			/>
		{:else}
			<Icon
				icon="material-symbols:play-circle-rounded"
				class="w-10 h-10 hover:scale-110 duration-100"
			/>
		{/if}
	</button>
	<button
		id="skip-button"
		disabled={$spaceRoleStore === 'member' && !$spaceStore?.allow_member_queue}
		on:click={onSkipTrack}
		aria-disabled={$spaceRoleStore === 'member' && !$spaceStore?.allow_member_queue}
		aria-label="Go to next track"
		class="disabled:text-dark-400"
	>
		<Icon
			icon="material-symbols:skip-next-rounded"
			class="w-10 h-10 hover:scale-110 duration-100"
		/>
	</button>
</div>
