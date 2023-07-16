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
	import { playSingleTrack, sliceQueue } from '$lib/session/queue';
	import { pauseTrack } from '$lib/spotify/player';
	import { spotifyAccessToken, spotifyPlayerId } from '$lib/spotify/spotify';
	import type { TrackBroadcastPayload } from '$lib/interfaces/session/broadcast.interface';
	import { toastValue } from '$lib/notification/toast';
	import { PUBLIC_NODE_ENV } from '$env/static/public';

	export let channel: RealtimeChannel;

	// Update track playing duration once ID changes (when music is being skipped, or a song ended)
	playingDurationMs.subscribe(async (durationMs) => {
		const trackId = $playingTrackId;
		const sessionQueue = $currentSessionQueue;
		const info = $playingInfo;

		// Do nothing if current playing duration does not exceed the track duration
		if (
			!trackId ||
			!sessionQueue ||
			!sessionQueue?.id ||
			!sessionQueue?.queues ||
			!info ||
			durationMs < info?.duration_ms
		)
			return;

		// No more queue
		if (sessionQueue?.queues?.length == 0) {
			toastValue.set({ message: 'Queue ended', type: 'info' });
			return;
		}

		// Check if the current track has ended, play next track if so (using admin's broadcasting)
		if (durationMs >= info?.duration_ms) {
			if ($currentSessionRole === 'admin') {
				const sliced = await sliceQueue(sessionQueue.queues, trackId, sessionQueue?.id);
				const payload: TrackBroadcastPayload = {
					isPlaying: $isPlayingStatus,
					playingTrackId: sliced[0]?.track_id,
					currentDurationMs: 0
				};
				channel.send({ type: 'broadcast', event: 'playerForward', payload });
			}
			toastValue.set({ message: 'Going next track', type: 'info' });
		}
	});

	// Set play pause status
	isPlayingStatus.subscribe(async (status) => {
		if (!$currentSessionQueue?.queues || !$currentSessionQueue?.queues?.length) {
			return;
		}

		if (PUBLIC_NODE_ENV === 'development') {
			console.log('isPlayingStatus', status);
		}

		if (status) {
			await playSingleTrack(
				$currentSessionQueue?.queues[0],
				$spotifyPlayerId,
				$spotifyAccessToken?.access_token
			);
		} else {
			await pauseTrack($spotifyPlayerId, $spotifyAccessToken?.access_token);
		}
	});

	onMount(() => {
		channel.on('broadcast', { event: 'playerStart' }, async ({ payload }) => {
			const _payload = payload as TrackBroadcastPayload;
			isPlayingStatus.set(_payload?.isPlaying);
			playingTrackId.set(_payload?.playingTrackId);
			playingDurationMs.set(_payload?.currentDurationMs);

			if (PUBLIC_NODE_ENV === 'development') {
				const rnd = Math.random();
				if (rnd < 0.2) {
					console.log('playerStart', _payload);
				}
			}
		});

		channel.on('broadcast', { event: 'playerBackward' }, async ({ payload }) => {
			const _payload = payload as TrackBroadcastPayload;

			if (!$currentSessionQueue?.queues || $currentSessionQueue?.queues?.length < 1) return;

			await playSingleTrack(
				$currentSessionQueue?.queues[0],
				$spotifyPlayerId,
				$spotifyAccessToken?.access_token
			);

			if (PUBLIC_NODE_ENV === 'development') {
				console.log('playerBackward', _payload);
			}
		});

		channel.on('broadcast', { event: 'playerForward' }, async ({ payload }) => {
			const _payload = payload as TrackBroadcastPayload;

			if (!$currentSessionQueue?.queues || $currentSessionQueue?.queues?.length < 2) return;

			await playSingleTrack(
				$currentSessionQueue?.queues[1],
				$spotifyPlayerId,
				$spotifyAccessToken?.access_token
			);

			if (PUBLIC_NODE_ENV === 'development') {
				console.log('playerForward', _payload);
			}
		});
	});
</script>
