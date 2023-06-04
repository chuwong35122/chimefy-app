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
	import type { TrackBroadcastPayload } from '$lib/interfaces/session/broadcast.interface';

	export let channel: RealtimeChannel;

	let timer: NodeJS.Timer;

	// Update track playing duration once ID changes
	playingTrackId.subscribe(async (id) => {
		clearTimeout(timer);

		if(!id) return

		await playSingleTrack()
		timer = setTimeout(() => {
			console.log($isPlayingStatus)
			if($isPlayingStatus === true) {
				playingDurationMs.update((prev) => prev + 1000);
			}
			console.log($playingDurationMs);
		}, 1000);
	});

	isPlayingStatus.subscribe(async () => {
		if ($isPlayingStatus === false) {
			await pauseTrack($spotifyPlayerId, $spotifyAccessToken?.access_token);
		}
	})

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
		playingTrackId.set(_queue.track_id);

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
			const _payload = payload as TrackBroadcastPayload;
			isPlayingStatus.set(_payload?.isPlaying)
			playingTrackId.set(_payload?.playingTrackId)
			playingDurationMs.set(_payload?.currentDurationMs)
		});

		channel.on('broadcast', { event: 'playerPlayed' }, ({ payload }) => {
			console.log(payload);
		});
	});
</script>
