<script lang="ts">
	import type { TrackBroadcastPayload } from '$lib/interfaces/session/broadcast.interface';
	import { toastValue } from '$lib/notification/toast';
	import {
		currentSessionQueue,
		currentSessionRole,
		isPlayingStatus,
		playingDurationMs,
		playingTrackId
	} from '$lib/session/session';
	import Icon from '@iconify/svelte';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import { Tooltip } from 'flowbite-svelte';

	export let onForwardTrack: () => void;
	export let onBackwardTrack: () => void;

	export let channel: RealtimeChannel;

	let broadcastTimer: NodeJS.Timer;

	function togglePlay() {
		onBroadcastSignal(true);
	}

	function togglePause() {
		onBroadcastSignal(false);
	}

	// Send broadcast signal to other members with its playing info
	async function onBroadcastSignal(playing: boolean) {
		const queues = $currentSessionQueue?.queues;
		if (queues && queues.length === 0) {
			toastValue.set({ message: 'Please add some tracks before playing!', type: 'warn' });
			return;
		}

		clearTimeout(broadcastTimer);

		broadcastTimer = setInterval(() => {
			const payload: TrackBroadcastPayload = {
				isPlaying: playing,
				playingTrackId: $playingTrackId,
				currentDurationMs: $playingDurationMs
			};

			channel.send({
				type: 'broadcast',
				event: 'playerStart',
				payload
			});
		}, 1000);
	}
</script>

{#if $currentSessionRole === 'member'}
	<Tooltip triggeredBy="#controller-section">Only admin controls the player</Tooltip>
{/if}
<div id="controller-section" class="flex flex-row items-center mb-2">
	<button
		disabled={$currentSessionRole === 'member'}
		aria-disabled={$currentSessionRole === 'member'}
		aria-label="Go to previous track"
		on:click={onBackwardTrack}
		class="disabled:text-dark-400"
	>
		<Icon
			icon="material-symbols:skip-previous-rounded"
			class="w-10 h-10 hover:scale-110 duration-100"
		/>
	</button>
	<button
		disabled={$currentSessionRole === 'member'}
		on:click={$isPlayingStatus ? togglePause : togglePlay}
		aria-disabled={$currentSessionRole === 'member'}
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
		disabled={$currentSessionRole === 'member'}
		on:click={onForwardTrack}
		aria-disabled={$currentSessionRole === 'member'}
		aria-label="Go to next track"
		class="disabled:text-dark-400"
	>
		<Icon
			icon="material-symbols:skip-next-rounded"
			class="w-10 h-10 hover:scale-110 duration-100"
		/>
	</button>
</div>
