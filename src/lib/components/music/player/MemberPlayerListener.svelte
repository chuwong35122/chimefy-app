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
	import { playNextTrack, playSingleTrack } from '$lib/session/queue';
	import { pauseTrack } from '$lib/spotify/player';
	import { spotifyAccessToken, spotifyPlayerId } from '$lib/spotify/spotify';
	import type { TrackBroadcastPayload } from '$lib/interfaces/session/broadcast.interface';
	import { toastValue } from '$lib/notification/toast';
	import { PUBLIC_NODE_ENV } from '$env/static/public';

	export let channel: RealtimeChannel;

	let timer: NodeJS.Timer;

	// Update track playing duration once ID changes
	playingTrackId.subscribe(async (id) => {
		clearTimeout(timer);
		if (!id) return;

		timer = setInterval(async () => {
			const queues = $currentSessionQueue?.queues;
			if (queues && queues.length === 0) {
				toastValue.set({ message: 'No queue left', type: 'info' });
				return;
			}

			// check if the queue ended
			if ($playingInfo && $playingDurationMs >= $playingInfo?.duration_ms) {
				await playNextTrack(
					$currentSessionQueue,
					$currentSessionRole,
					$playingInfo,
					$spotifyPlayerId,
					$spotifyAccessToken?.access_token
				);
				toastValue.set({ message: 'Going next track', type: 'info' });
			}
		}, 1000);
	});

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

			if (!$currentSessionQueue?.queues || $currentSessionQueue?.queues?.length < 2) return;

			isPlayingStatus.set(_payload?.isPlaying);
			playingTrackId.set(_payload?.playingTrackId);
			playingDurationMs.set(0);
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

			isPlayingStatus.set(_payload?.isPlaying);
			playingTrackId.set(_payload?.playingTrackId);
			playingDurationMs.set(0);
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
