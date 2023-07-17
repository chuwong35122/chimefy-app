<script lang="ts">
	import {
		currentSessionRole,
		currentSession,
		isPlayingStatus,
		playingDurationMs
	} from '$utils/session/session';
	import Icon from '@iconify/svelte';
	import { onDestroy, onMount } from 'svelte';
	import { Tooltip } from 'flowbite-svelte';
	import VolumeController from './player/VolumeController.svelte';
	import TrackPreview from './player/TrackPreview.svelte';
	import ControlButtons from './player/ControlButtons.svelte';
	import { supabase } from '$lib/supabase/supabase';
	import MemberPlayerListener from './player/MemberPlayerListener.svelte';
	import { PUBLIC_NODE_ENV } from '$env/static/public';
	import DebugBgWrapper from '../UI/DebugBgWrapper.svelte';
	import { spotifyPlayerId, spotifyAccessToken } from '$stores/spotify/user';

	let SpotifyPlayer: Spotify.Player;

	let trackDurationTimer: NodeJS.Timer;

	const channel = supabase.channel(`session_player_listener_${$currentSession?.id}`, {
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
				volume: 0.5
			});

			SpotifyPlayer.on('ready', async ({ device_id }) => {
				if (PUBLIC_NODE_ENV === 'development') {
					console.log('Ready with Device ID', device_id);
				}
				spotifyPlayerId.set(device_id);
			});

			SpotifyPlayer.on('initialization_error', (err) => {
				if (PUBLIC_NODE_ENV === 'development') {
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
			<VolumeController {SpotifyPlayer} />
		</div>
		<Tooltip triggeredBy="[id=connected-player]" placement="bottom"
			>Connected to {SpotifyPlayer?._options?.name}</Tooltip
		>
	</div>
</div>

{#if PUBLIC_NODE_ENV === 'development'}
	<div class="flex flex-row items-center justify-between">
		<DebugBgWrapper debuggerTitle="Player Debugger">
			<p>Role: {$currentSessionRole}</p>
			<p>Spotify Player Id: {$spotifyPlayerId}</p>
			<p>Player Options: {JSON.stringify(SpotifyPlayer?._options)}</p>
		</DebugBgWrapper>
		<DebugBgWrapper debuggerTitle="Controller Debugger">
			<p>Playing duration: {$playingDurationMs} ms</p>
			<p>Player status: {$isPlayingStatus}</p>
		</DebugBgWrapper>
	</div>
{/if}
