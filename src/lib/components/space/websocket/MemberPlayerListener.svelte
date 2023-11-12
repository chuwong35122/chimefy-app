<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { isPlayingStatus, playingInfo, playingTrackId, playingDurationMs } from '$stores/player';
	import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
	import { playSingleTrack, sliceQueue } from '$utils/space/queue';
	import { pauseTrack } from '$spotify/player';
	import type { TrackBroadcastPayload } from '$lib/types/space/broadcast.interface';
	import { toastValue } from '$stores/notification/toast';
	import { appTokenStore, spotifyPlayerId } from '$stores/spotify/user';
	import { devModeStore } from '$stores/settings';
	import { spaceStore, spaceRoleStore } from '$stores/space';

	export let channel: RealtimeChannel;
	export let supabase: SupabaseClient;

	// Update track playing duration once ID changes (when music is being skipped, or a song ended)
	playingDurationMs.subscribe(async (durationMs) => {
		const trackId = $playingTrackId;
		const space = $spaceStore;
		const info = $playingInfo;

		if (
			// Do nothing if current playing duration does not exceed the track duration
			!trackId ||
			!space?.id ||
			!space?.queues ||
			!info ||
			durationMs < info?.duration_ms
		)
			return;

		if (durationMs >= info?.duration_ms) {
			// Check if the current track has ended, play next track if so (using admin's broadcasting)
			if ($spaceRoleStore === 'admin') {
				const payload: TrackBroadcastPayload = {
					isPlaying: $isPlayingStatus,
					playingTrackId: space.queues[1].id,
					currentDurationMs: 0
				};
				channel.send({ type: 'broadcast', event: 'playerForward', payload });
			}
			toastValue.set({ message: 'Going next track', type: 'info' });
		}
	});

	// Set play pause status
	isPlayingStatus.subscribe(async (status) => {
		if (!$spaceStore?.queues || !$spaceStore?.queues?.length) {
			return;
		}

		if ($devModeStore) {
			console.log('isPlayingStatus', status);
		}

		if ($spaceStore && status) {
			await playSingleTrack(
				$spaceStore?.queues[0],
				$spotifyPlayerId,
				$playingDurationMs,
				$appTokenStore?.access_token
			);
		} else {
			await pauseTrack($spotifyPlayerId, $appTokenStore?.access_token);
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

			if (!$spaceStore?.queues || $spaceStore?.queues?.length < 1) return;

			await playSingleTrack(
				$spaceStore?.queues[0],
				$spotifyPlayerId,
				0,
				$appTokenStore?.access_token
			);

			if ($devModeStore) {
				console.log('playerBackward', _payload);
			}
		});

		// Listen for player event when the admin skip a track
		channel.on('broadcast', { event: 'playerForward' }, async ({ payload }) => {
			const queues = $spaceStore.queues;

			if (!queues || queues?.length < 2) return;

			const sliced = await sliceQueue(supabase, queues, queues[0]?.id, $spaceStore.id);
			const _payload = payload as TrackBroadcastPayload;

			await playSingleTrack(sliced[0], $spotifyPlayerId, 0, $appTokenStore?.access_token);

			if ($devModeStore) {
				console.log('playerForward', _payload);
			}
		});
	});

	onDestroy(() => {
		channel.unsubscribe();
	});
</script>
