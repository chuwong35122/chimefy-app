<script lang="ts">
	import { onMount } from 'svelte';
	import {
		currentSessionRole,
		isPlayingStatus,
		playingInfo,
		currentSessionQueue,
		playingTrackId,
		playingDurationMs
	} from '$stores/session';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import { playSingleTrack, sliceQueue } from '$utils/session/queue';
	import { pauseTrack } from '$spotify/player';
	import type { TrackBroadcastPayload } from '$interfaces/session/broadcast.interface';
	import { toastValue } from '$stores/notification/toast';
	import { spotifyAccessToken, spotifyPlayerId } from '$stores/spotify/user';
	import { devModeStore } from '$stores/navigation/mode';

	export let channel: RealtimeChannel;

	// Update track playing duration once ID changes (when music is being skipped, or a song ended)
	playingDurationMs.subscribe(async (durationMs) => {
		const trackId = $playingTrackId;
		const sessionQueue = $currentSessionQueue;
		const info = $playingInfo;

		if (
			// Do nothing if current playing duration does not exceed the track duration
			!trackId ||
			!sessionQueue ||
			!sessionQueue?.id ||
			!sessionQueue?.queues ||
			!info ||
			durationMs < info?.duration_ms
		)
			return;

		if (durationMs >= info?.duration_ms) {
			// Check if the current track has ended, play next track if so (using admin's broadcasting)
			if ($currentSessionRole === 'admin') {
				// const sliced = await sliceQueue(sessionQueue.queues, trackId, sessionQueue?.id);
				const payload: TrackBroadcastPayload = {
					isPlaying: $isPlayingStatus,
					playingTrackId: sessionQueue.queues[1].track_id,
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

		if ($devModeStore) {
			console.log('isPlayingStatus', status);
		}

		if ($currentSessionQueue && status) {
			await playSingleTrack(
				$currentSessionQueue?.queues[0],
				$spotifyPlayerId,
				$playingDurationMs,
				$spotifyAccessToken?.access_token
			);
		} else {
			await pauseTrack($spotifyPlayerId, $spotifyAccessToken?.access_token);
		}
	});

	/**
	 * Listen for player event when the admin plays/pause a track
	 * Note: Must not play track here since it will always fire play request to Spotify
	 * (must handle with subscriber as above)
	 * */
	onMount(() => {
		channel.on('broadcast', { event: 'playerStart' }, async ({ payload }) => {
			const _payload = payload as TrackBroadcastPayload;
			playingDurationMs.set(_payload?.currentDurationMs);
			playingTrackId.set(_payload?.playingTrackId);
			isPlayingStatus.set(_payload?.isPlaying);

			if ($devModeStore) {
				const rnd = Math.random();
				if (rnd < 0.2) {
					console.log('playerStart', _payload);
				}
			}
		});

		// Listen for player event when the admin press backward
		channel.on('broadcast', { event: 'playerBackward' }, async ({ payload }) => {
			const _payload = payload as TrackBroadcastPayload;

			if (!$currentSessionQueue?.queues || $currentSessionQueue?.queues?.length < 1) return;

			await playSingleTrack(
				$currentSessionQueue?.queues[0],
				$spotifyPlayerId,
				0,
				$spotifyAccessToken?.access_token
			);

			if ($devModeStore) {
				console.log('playerBackward', _payload);
			}
		});

		// Listen for player event when the admin skip a track
		channel.on('broadcast', { event: 'playerForward' }, async ({ payload }) => {
			const sessionQueue = $currentSessionQueue;
			if (!sessionQueue?.queues || sessionQueue?.queues?.length < 2 || !sessionQueue?.id) return;

			const sliced = await sliceQueue(sessionQueue?.queues, sessionQueue?.queues[0]?.track_id, sessionQueue?.id);
			const _payload = payload as TrackBroadcastPayload;

				await playSingleTrack(
					sliced[0],
					$spotifyPlayerId,
					0,
					$spotifyAccessToken?.access_token
				);
			

			if ($devModeStore) {
				console.log('playerForward', _payload);
			}
		});
	});
</script>
