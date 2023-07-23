<script lang="ts">
	import {
		currentSession,
		isPlayingStatus,
		playingDurationMs,
		currentSessionQueue
	} from '$stores/session';
	import Icon from '@iconify/svelte';
	import { onDestroy, onMount } from 'svelte';
	import { Tooltip } from 'flowbite-svelte';
	import VolumeController from './player/VolumeController.svelte';
	import TrackPreview from './player/TrackPreview.svelte';
	import ControlButtons from './player/ControlButtons.svelte';
	import { supabase } from '$lib/supabase/supabase';
	import MemberPlayerListener from '../listeners/MemberPlayerListener.svelte';
	import { spotifyPlayerId, spotifyAccessToken } from '$stores/spotify/user';
	import DebugText from '$components/debugger/DebugText.svelte';
	import { devModeStore } from '$stores/navigation/mode';

	export let sessionId = 0;
	export let volume = 50;

	let SpotifyPlayer: Spotify.Player;
	let trackDurationTimer: NodeJS.Timer;

	const channel = supabase.channel(`session_player_listener_${sessionId}`, {
		config: {
			broadcast: {
				self: true
			}
		}
	});

	onMount(async () => {
		window.onSpotifyWebPlaybackSDKReady = async () => {
			SpotifyPlayer = new Spotify.Player({
				name: 'Chimefy Player',
				getOAuthToken: (cb) => {
					cb($spotifyAccessToken?.access_token);
				},
				volume: volume/100
			});

			SpotifyPlayer.on('ready', async ({ device_id }) => {
				if ($devModeStore) {
					console.log('Ready with Device ID', device_id);
				}
				spotifyPlayerId.set(device_id);
			});

			SpotifyPlayer.on('initialization_error', (err) => {
				if ($devModeStore) {
					console.error(err);
				}
			});

			// Put the connect() at the bottom most of player.on()
			await SpotifyPlayer?.connect();
		};

		channel.subscribe();

		trackDurationTimer = setInterval(() => {
			if ($isPlayingStatus === false) return;

			playingDurationMs.update((prev) => prev + 1000);
		}, 1000);
	});

	onDestroy(() => {
		SpotifyPlayer?.disconnect();
		clearTimeout(trackDurationTimer);
	});
</script>

<svelte:head>
	<script src="https://sdk.scdn.co/spotify-player.js"></script>
</svelte:head>

<div class="relative w-full p-2 rounded-xl bg-dark-500 hover:bg-white/10 duration-200">
	<div class="flex flex-row items-center justify-between">
		<TrackPreview />
		<div class="flex flex-col items-center">
			<ControlButtons {channel} />
			{#if $currentSession?.id}
				<MemberPlayerListener {channel} />
			{/if}
		</div>
		<div class="flex flex-row">
			<Icon
				id="connected-player"
				icon="material-symbols:speaker-group"
				class="text-dark-200 mt-1 mr-1"
			/>
			<VolumeController {SpotifyPlayer} {volume} />
		</div>
		<Tooltip triggeredBy="[id=connected-player]" placement="bottom"
			>Connected to {SpotifyPlayer?._options?.name}</Tooltip
		>
	</div>
</div>

<DebugText text={`Spotify player ID: ${$spotifyPlayerId}`} />
<DebugText text={`Spotify player options: ${JSON.stringify(SpotifyPlayer?._options)}`} />
<DebugText text={`Player duration: ${$playingDurationMs} ms`} />
<DebugText text={`Track total duration: ${$currentSessionQueue?.queues[0]?.duration_ms} ms`} />
<DebugText text={`Player status: ${$isPlayingStatus ? 'Playing' : 'Pause'}`} />
