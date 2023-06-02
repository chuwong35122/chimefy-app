<script lang="ts">
	import { onMount } from 'svelte';
	import {
		currentSessionRole,
		isPlayingStatus,
		playingInfo,
		currentSessionQueue,
		spotifyPlayerDeviceId,
		playingTrackId,
		playingDurationMs
	} from '$lib/session/session';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import { sliceQueue } from '$lib/session/queue';
	import { playTrack, pauseTrack, setActiveSpotifyPlayer } from '$lib/spotify/player';
	import { spotifyAccessToken, spotifyPlayerId } from '$lib/spotify/spotify';

	export let channel: RealtimeChannel;
	export let SpotifyPlayer: Spotify.Player;

	let hasSetActivePlayer = false;

	// Play the topmost track and remove it from the database
	async function playSingleTrack() {
		const queues = $currentSessionQueue?.queues;
		if (!queues || !queues[0] || !$currentSessionQueue || !$currentSessionQueue?.id) return;

		const _queue = queues[0];
		await playTrack(
			_queue,
			$spotifyPlayerId,
			$playingDurationMs,
			$spotifyAccessToken?.access_token
		);
		playingInfo.set({
			..._queue
		});

		// if ($currentSessionRole === 'admin' && $playingTrackId !== _queue.track_id) {
		// 	await sliceQueue(
		// 		$currentSessionQueue?.queues,
		// 		$playingInfo?.track_id,
		// 		$currentSessionQueue?.id
		// 	);
		// }
	}

	isPlayingStatus.subscribe(async (status) => {
		if (status === false) return;

		await playSingleTrack();
	});

	onMount(() => {
		channel.on('broadcast', { event: 'playerStart' }, async ({ payload }) => {
			if (payload?.isPlaying !== undefined) {
				isPlayingStatus.set(payload.isPlaying);

				if (payload.isPlaying) {
					if (!hasSetActivePlayer) {
						await setActiveSpotifyPlayer($spotifyPlayerDeviceId, $spotifyAccessToken?.access_token);
						hasSetActivePlayer = true;
					}

					await playSingleTrack();
				} else {
					await pauseTrack($spotifyPlayerDeviceId, $spotifyAccessToken?.access_token);
				}
			}
		});

		channel.on('broadcast', { event: 'playerPlayed' }, ({ payload }) => {
			console.log(payload);
		});
	});
</script>
