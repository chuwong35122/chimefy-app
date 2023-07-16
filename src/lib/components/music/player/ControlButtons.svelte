<script lang="ts">
	import type { TrackBroadcastPayload } from '$lib/interfaces/session/broadcast.interface';
	import { toastValue } from '$lib/notification/toast';
	import { sliceQueue } from '$lib/session/queue';
	import {
		currentSessionQueue,
		currentSessionRole,
		isPlayingStatus,
		playingDurationMs,
		playingInfo,
		playingTrackId
	} from '$lib/session/session';
	import Icon from '@iconify/svelte';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import { Tooltip } from 'flowbite-svelte';

	export let channel: RealtimeChannel;

	// Check for queues. If there are, trigger real-time channel broadcast to go forward.
	async function onForwardTrack() {
		const queues = $currentSessionQueue?.queues;
		const queueId = $currentSessionQueue?.id;

		if (queues && queues.length < 2) {
			toastValue.set({ message: 'Please add some tracks!', type: 'warn' });
			return;
		}

		toastValue.set({ message: 'Skipping track...', type: 'info' });
		playingDurationMs.set(0);

		if ($currentSessionRole === 'admin' && queues && queues.length > 0 && queueId && $playingInfo) {
			const sliced = await sliceQueue(queues, $playingInfo?.track_id, queueId);
			const payload: TrackBroadcastPayload = {
				isPlaying: $isPlayingStatus,
				playingTrackId: sliced[0]?.track_id,
				currentDurationMs: 0
			};

			channel.send({
				type: 'broadcast',
				event: 'playerForward',
				payload
			});
		}
	}

	// Check for queues. If there are, trigger real-time channel broadcast to go back.
	async function onBackwardTrack() {
		const queues = $currentSessionQueue?.queues;
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
			currentDurationMs: $playingDurationMs
		};

		channel.send({
			type: 'broadcast',
			event: 'playerBackward',
			payload
		});
	}

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

		if (queues && queues[0]) {
			playingTrackId.set(queues[0]?.track_id);
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
