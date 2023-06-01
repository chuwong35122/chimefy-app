<script lang="ts">
	import {
		currentSessionRole,
		currentSessionQueue,
		playingInfo,
		spotifyPlayerDeviceId,
		hasConfirmedBroadcast
	} from '$lib/session/session';
	import Icon from '@iconify/svelte';
	import { onDestroy, onMount } from 'svelte';
	import { spotifyAccessToken, spotifyPlayerId } from '$lib/spotify/spotify';
	import { Modal, Tooltip } from 'flowbite-svelte';
	import { playTrack } from '$lib/spotify/player';
	import SpotifyTrackBroadcastModal from '../modals/SpotifyTrackBroadcastModal.svelte';
	import { toastValue } from '$lib/notification/toast';
	import VolumeController from './player/VolumeController.svelte';
	import TrackPreview from './player/TrackPreview.svelte';
	import ControlButtons from './player/ControlButtons.svelte';
	import { userStore } from '$lib/supabase/user';

	let broadcastModal = false;
	let SpotifyPlayer: Spotify.Player;
	let timer: NodeJS.Timer;

	let volume = 50;
	let debouncedVolume = 0;

	function handleChangeSessionInfo() {}

	// open broadcast modal, and play send track info
	async function togglePlay() {
		broadcastModal = false;

		if ($currentSessionRole !== 'admin') return;
		if (!$hasConfirmedBroadcast && !broadcastModal) {
			broadcastModal = true;
			return;
		}

		try {
			await playTrack(
				$playingInfo,
				$spotifyPlayerDeviceId,
				$currentSessionQueue?.queues ?? [],
				$spotifyAccessToken?.access_token
			);
		} catch (e) {
			console.log(e);
		}
	}

	async function togglePause() {
		try {
			const _prevInfo = { ...$playingInfo };
			playingInfo.set({ ..._prevInfo, is_playing: false });

			await fetch('/api/spotify/playback/pause', {
				method: 'POST',
				body: JSON.stringify({
					device_id: $spotifyPlayerDeviceId,
					access_token: $spotifyAccessToken?.access_token
				})
			});
			handleChangeSessionInfo();
			clearInterval(timer);
		} catch (e) {
			console.error(e);
		}
	}

	// request for current playing music
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
				toastValue.set({ message: 'Spotify player is ready!! 🎵', type: 'info' });
				spotifyPlayerId.set(device_id);
			});
			SpotifyPlayer.on('initialization_error', (err) => {
				console.log(err.message);
			});

			SpotifyPlayer.on('player_state_changed', (val) => {
				// console.log(val);
			});

			// Put the connect() at the bottom most of player.on()
			await SpotifyPlayer?.connect();
		};
	});

	onDestroy(() => {
		SpotifyPlayer?.disconnect();
	});
</script>

<svelte:head>
	<script src="https://sdk.scdn.co/spotify-player.js"></script>
</svelte:head>

<div>{JSON.stringify($playingInfo)}</div>
<Modal bind:open={broadcastModal} size="xs" autoclose={false} class="modal-glass">
	<SpotifyTrackBroadcastModal on:broadcast={togglePlay} />
</Modal>
<div class="relative w-full p-2 rounded-xl bg-dark-500 hover:bg-white/10 duration-200">
	<div class="flex flex-row items-center justify-between">
		<TrackPreview />
		<div class="flex flex-col items-center">
			<ControlButtons {togglePlay} {togglePause} />
		</div>
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
