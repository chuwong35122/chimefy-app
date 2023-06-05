<script lang="ts">
	import { onMount } from 'svelte';
	import {
		currentSessionRole,
		isPlayingStatus,
		playingInfo,
		currentSessionQueue,
		playingTrackId,
		playingDurationMs
	} from '$lib/session/session';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import { sliceQueue } from '$lib/session/queue';
	import { playTrack, pauseTrack } from '$lib/spotify/player';
	import { spotifyAccessToken, spotifyPlayerId } from '$lib/spotify/spotify';
	import type { TrackBroadcastPayload } from '$lib/interfaces/session/broadcast.interface';
	import type { MusicQueue } from '$lib/interfaces/session/queue.interface';
	import { toastValue } from '$lib/notification/toast';

	export let channel: RealtimeChannel;
	export let onBroadcastSignal: (playing: boolean) => void;

	let timer: NodeJS.Timer;

	async function playNextTrack() {
		const queueId = $currentSessionQueue?.id;
		const queues = $currentSessionQueue?.queues;

		if ($currentSessionRole === 'admin' && queueId && queues) {
			const sliced = await sliceQueue(queues, $playingInfo?.track_id, queueId);

			if (sliced[0]) {
				await playSingleTrack(sliced[0]);
			}
		}
	}

	// Update track playing duration once ID changes
	playingTrackId.subscribe(async (id) => {
		clearTimeout(timer);
		if (!id) return;

		timer = setInterval(async () => {
			const queues = $currentSessionQueue?.queues;
			if (queues && queues.length === 0) {
				onBroadcastSignal(false);
				toastValue.set({message: 'No queue left', type: 'info'})
				return;
			}

			if ($playingDurationMs >= $playingInfo?.duration_ms) {
				playingDurationMs.set(0)
				// check if the queue ended
				await playNextTrack();
				toastValue.set({message: 'Going next track', type: 'info'})
			}
		}, 1000);
	});

	isPlayingStatus.subscribe(async () => {
		if ($isPlayingStatus === false) {
			await pauseTrack($spotifyPlayerId, $spotifyAccessToken?.access_token);
		}
	});

	// Play the topmost track and remove it from the database
	async function playSingleTrack(queue: MusicQueue) {
		if(!queue) return;

		await playTrack(
			queue,
			$spotifyPlayerId,
			$playingDurationMs,
			$spotifyAccessToken?.access_token
		);
		playingInfo.set({
			...queue
		});
		playingTrackId.set(queue.track_id);
	}

	isPlayingStatus.subscribe(async (status) => {
		if (status === false || !$currentSessionQueue?.queues || !$currentSessionQueue?.queues?.length)
			return;

		await playSingleTrack($currentSessionQueue?.queues[0]);
	});

	onMount(() => {
		channel.on('broadcast', { event: 'playerStart' }, async ({ payload }) => {
			const _payload = payload as TrackBroadcastPayload;
			isPlayingStatus.set(_payload?.isPlaying);
			playingTrackId.set(_payload?.playingTrackId);
			playingDurationMs.set(_payload?.currentDurationMs);
		});

		channel.on('broadcast', { event: 'playerBackward' }, async ({ payload }) => {
			const _payload = payload as TrackBroadcastPayload;

			if (!$currentSessionQueue?.queues || $currentSessionQueue?.queues?.length < 2) return;

			await playSingleTrack($currentSessionQueue?.queues[0]);
			isPlayingStatus.set(_payload?.isPlaying);
			playingTrackId.set(_payload?.playingTrackId);
			playingDurationMs.set(0);
		});

		channel.on('broadcast', { event: 'playerForward' }, async ({ payload }) => {
			const _payload = payload as TrackBroadcastPayload;

			if (!$currentSessionQueue?.queues || $currentSessionQueue?.queues?.length < 2) return;

			await playSingleTrack($currentSessionQueue?.queues[1]);
			isPlayingStatus.set(_payload?.isPlaying);
			playingTrackId.set(_payload?.playingTrackId);
			playingDurationMs.set(0);
		});
	});
</script>
