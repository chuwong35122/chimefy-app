<script lang="ts">
	import type { TrackBroadcastPayload } from '$lib/interfaces/session/broadcast.interface';
	import { toastValue } from '$stores/notification/toast';
	import { sliceQueue } from '$utils/session/queue';
	import {
		currentSession,
		currentSessionQueue,
		currentSessionRole,
		isPlayingStatus,
		playingDurationMs,
		playingInfo,
		playingTrackId
	} from '$stores/session';
	import Icon from '@iconify/svelte';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import { Tooltip } from 'flowbite-svelte';

	export let channel: RealtimeChannel;

	// Check for queues. If there are, trigger real-time channel broadcast to go forward.
	async function onSkipTrack() {
		if ($currentSessionRole === 'member' && !$currentSession?.allow_member_queue) {
			toastValue.set({ message: 'Admin does not allow members to skip track.', type: 'info' });
			return;
		}

		const queues = $currentSessionQueue?.queues;
		const queueId = $currentSessionQueue?.id;

		if (queues && queues.length < 2) {
			toastValue.set({ message: 'Please add some tracks!', type: 'warn' });
			return;
		}

		toastValue.set({ message: 'Skipping track...', type: 'info' });
		playingDurationMs.set(0);

		if (queues && queues.length > 0 && queueId && $playingInfo) {
			const payload: TrackBroadcastPayload = {
				isPlaying: $isPlayingStatus,
				playingTrackId: queues[1]?.track_id,
				currentDurationMs: 0,
			};

			channel.send({
				type: 'broadcast',
				event: 'playerForward',
				payload
			});
		}
	}

	// Check for queues. If there are, trigger real-time channel broadcast to go back.
	async function onRestartTrack() {
		if ($currentSessionRole === 'member' && !$currentSession?.allow_member_queue) {
			toastValue.set({
				message: 'Admin does not allow members to go to replay track.',
				type: 'info'
			});
			return;
		}

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
			currentDurationMs: $playingDurationMs,
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
				currentDurationMs: $playingDurationMs,
			};

			channel.send({
				type: 'broadcast',
				event: 'playerStart',
				payload
			});
		}, 1000);
	}
</script>

<Tooltip triggeredBy="#back-button">
	{#if $currentSessionRole === 'member' && !$currentSession?.allow_member_queue}
		Admin does not allow going back
	{:else}
		Go back
	{/if}
</Tooltip>

<Tooltip triggeredBy="#skip-button">
	{#if $currentSessionRole === 'member' && !$currentSession?.allow_member_queue}
		Admin does not allow skipping track
	{:else}
		Skip track
	{/if}
</Tooltip>

<Tooltip triggeredBy="#play-pause-button">
	{#if $currentSessionRole === 'member'}
		Only admin can play/pause
	{:else}
		Play/Pause
	{/if}
</Tooltip>

<div id="controller-section" class="flex flex-row items-center mb-2">
	<button
		id="back-button"
		disabled={$currentSessionRole === 'member' && !$currentSession?.allow_member_queue}
		aria-disabled={$currentSessionRole === 'member' && !$currentSession?.allow_member_queue}
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
		id="skip-button"
		disabled={$currentSessionRole === 'member' && !$currentSession?.allow_member_queue}
		on:click={onSkipTrack}
		aria-disabled={$currentSessionRole === 'member' && !$currentSession?.allow_member_queue}
		aria-label="Go to next track"
		class="disabled:text-dark-400"
	>
		<Icon
			icon="material-symbols:skip-next-rounded"
			class="w-10 h-10 hover:scale-110 duration-100"
		/>
	</button>
</div>
