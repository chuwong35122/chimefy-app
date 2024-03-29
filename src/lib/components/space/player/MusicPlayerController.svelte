<script lang="ts">
	import { isPlayingStatus, playingDurationMs } from '$stores/player';
	import Icon from '@iconify/svelte';
	import { onDestroy, onMount } from 'svelte';
	import { Tooltip } from 'flowbite-svelte';
	import VolumeController from '$lib/components/space/player/VolumeController.svelte';
	import TrackPreview from '../track/TrackPreview.svelte';
	import ControlButtons from './ControlButtons.svelte';
	import MemberPlayerListener from '../websocket/MemberPlayerListener.svelte';
	import { spotifyPlayerId, appTokenStore } from '$stores/spotify/user';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { spaceStore } from '$stores/space';
	import { userConfigStore } from '$stores/auth/user';
	import { toastValue } from '$stores/notification/toast';

	export let supabase: SupabaseClient;
	export let spaceId = 0;

	let SpotifyPlayer: Spotify.Player;
	let trackDurationTimer: NodeJS.Timer;

	const channel = supabase.channel(`space_player_listener_${spaceId}`, {
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
					cb($appTokenStore?.spotify_access_token);
				},
				volume: $userConfigStore?.player_volume / 100
			});

			SpotifyPlayer.on('ready', async ({ device_id }) => {
				toastValue.set({ message: 'You have been connected to Spotify player 📻', type: 'info' });
				spotifyPlayerId.set(device_id);
			});

			SpotifyPlayer.on('initialization_error', (err) => {
				toastValue.set({
					message:
						'Sorry, there is an error connecting to Spotify player. Please refresh the page 😭...',
					type: 'error'
				});
			});

			// Put the connect() at the bottom most of player.on()
			await SpotifyPlayer?.connect();
		};

		channel.subscribe();

		trackDurationTimer = setInterval(() => {
			if ($isPlayingStatus === false) return;

			// Update player's duration every second if playing
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

<div class="relative w-full p-2 rounded-xl bg-glass hover:bg-white/10 duration-200">
	<div class="flex flex-row items-center justify-between">
		<div class="w-1/3">
			<TrackPreview />
		</div>
		<div class="w-1/3 flex flex-col items-center">
			<ControlButtons {channel} />
			{#if $spaceStore?.id}
				<MemberPlayerListener {channel} {supabase} />
			{/if}
		</div>
		<div class="w-1/3 flex flex-row justify-end">
			<Icon
				id="connected-player"
				icon="material-symbols:speaker-group"
				class="text-dark-200 mt-1 mr-1"
			/>
			<VolumeController {supabase} {SpotifyPlayer} />
		</div>
		<Tooltip triggeredBy="[id=connected-player]" placement="bottom"
			>Connected to {SpotifyPlayer?._options?.name}</Tooltip
		>
	</div>
</div>