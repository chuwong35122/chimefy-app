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
	import { playTrack, pauseTrack, setActiveSpotifyPlayer } from '$lib/spotify/player';
	import { spotifyAccessToken, spotifyPlayerId } from '$lib/spotify/spotify';
	import type { TrackBroadcastPayload } from '$lib/interfaces/session/broadcast.interface';
	import type { MusicQueue } from '$lib/interfaces/session/queue.interface';

	export let channel: RealtimeChannel;

	let timer: NodeJS.Timer;

	async function playNextTrack() {
		const queueId = $currentSessionQueue?.id;
		const queues = $currentSessionQueue?.queues;

		if ($currentSessionRole === 'admin' && queueId && queues) {
			await sliceQueue(queues, $playingInfo?.track_id, queueId);
		}
	}

	// Update track playing duration once ID changes
	playingTrackId.subscribe(async (id) => {
		clearTimeout(timer);

		// if (status === false || !$currentSessionQueue?.queues || !$currentSessionQueue?.queues?.length)

		if (!id) return;

		// await playSingleTrack();
		timer = setTimeout(async () => {
			if ($playingDurationMs + 3000 >= $playingInfo?.duration_ms) {
				await playNextTrack();
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
		await playTrack(
			queue,
			$spotifyPlayerId,
			// 180_000,
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

		channel.on('broadcast', { event: 'playerPlayed' }, ({ payload }) => {
			console.log(payload);
		});

		channel.on('broadcast', { event: 'playerBackward' }, async ({ payload }) => {
			const _payload = payload as TrackBroadcastPayload;

			if (!$currentSessionQueue?.queues || $currentSessionQueue?.queues?.length < 2) return;

			await playSingleTrack($currentSessionQueue?.queues[1]);
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
