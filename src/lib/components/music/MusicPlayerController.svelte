<script lang="ts">
	import {
		currentSessionRole,
		currentSessionQueue,
		currentSession,
		playingInfo,
		spotifyPlayerDeviceId,
		isPlayingStatus,
		playingDurationMs
	} from '$lib/session/session';
	import Icon from '@iconify/svelte';
	import { onDestroy, onMount } from 'svelte';
	import { spotifyAccessToken, spotifyPlayerId } from '$lib/spotify/spotify';
	import { Tooltip } from 'flowbite-svelte';
	import VolumeController from './player/VolumeController.svelte';
	import TrackPreview from './player/TrackPreview.svelte';
	import ControlButtons from './player/ControlButtons.svelte';
	import { supabase } from '$lib/supabase/supabase';
	import MemberPlayerListener from './player/MemberPlayerListener.svelte';
	import { millisecondToMinuteSeconds } from '$lib/utils/common/time';

	let SpotifyPlayer: Spotify.Player;

	let volume = 50;
	let debouncedVolume = 0;

	const channel = supabase.channel(`session_player_listener_${$currentSession?.id}`, {
		config: {
			broadcast: {
				self: true
			}
		}
	})

	// open broadcast modal, and play send track info
	async function onBroadcastSignal(playing: boolean) {
		channel.send({
      type: 'broadcast',
      event: 'playerStart',
      payload: { isPlaying: playing },
    })
	}

	async function onPlayerStateChange() {
		if($isPlayingStatus === false) return;

		if($playingDurationMs < $playingInfo?.duration_ms) {

		}else{
			// admin delete topmost queue
		}
	}


	// TODO: handle error if spotify player cannot be connected!
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
				spotifyPlayerDeviceId.set(device_id);
				console.log('Spotify player is ready!! 🎵');
				spotifyPlayerId.set(device_id);
			});
			SpotifyPlayer.on('initialization_error', (err) => {
				console.log(err.message);
			});

			// Put the connect() at the bottom most of player.on()
			await SpotifyPlayer?.connect();
		};

		channel.subscribe();
	});

	onDestroy(() => {
		SpotifyPlayer?.disconnect();
	});
</script>

<svelte:head>
	<script src="https://sdk.scdn.co/spotify-player.js"></script>
</svelte:head>


<div class="relative w-full p-2 rounded-xl bg-dark-500 hover:bg-white/10 duration-200">
	<div class="flex flex-row items-center justify-between">
		<TrackPreview />
		<div class="flex flex-col items-center">
			{#if $currentSessionRole === 'admin'}
				<ControlButtons {onBroadcastSignal} />
			{/if}

			{#if $currentSession?.id}
				<MemberPlayerListener {channel} {SpotifyPlayer} />
			{/if}
		</div>
		<div class='text-xs'>{millisecondToMinuteSeconds($playingDurationMs)}</div>
		<div class="flex flex-row">
			<Icon
				id="connected-player"
				icon="material-symbols:speaker-group"
				class="text-dark-200 mt-1 mr-1"
			/>
			<VolumeController {volume} {debouncedVolume} {SpotifyPlayer} />
		</div>
		<Tooltip triggeredBy="[id=connected-player]" placement="bottom"
			>Connected to {SpotifyPlayer?._options?.name}</Tooltip
		>
	</div>
</div>
