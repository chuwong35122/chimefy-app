<script lang="ts">
	import {
		currentSessionRole,
		currentSession,
		currentSessionQueue,
		playingInfo,
		spotifyPlayerDeviceId,
		hasConfirmedBroadcast
	} from '$lib/session/session';
	import Icon from '@iconify/svelte';
	import { millisecondToMinuteSeconds } from '$lib/utils/common/time';
	import { onDestroy, onMount } from 'svelte';
	import { spotifyAccessToken, spotifyPlayerId } from '$lib/spotify/spotify';
	import { Modal, Tooltip } from 'flowbite-svelte';
	import {
		changeSessionPlayInfo,
		detectSessionChange,
		fastForwardCurrentTrack,
		forwardTrack,
		playTrack,
		setActiveSpotifyPlayer,
		updatePlayInfo
	} from '$lib/spotify/player';
	import SpotifyTrackBroadcastModal from '../modals/SpotifyTrackBroadcastModal.svelte';
	import { toastValue } from '$lib/notification/toast';
	import { ioClient } from '$lib/socket/client';
	import type { SessionBroadcastRequest } from '$lib/interfaces/session/socket.interface';
	import { supabase } from '$lib/supabase/supabase';
	import VolumeController from './player/VolumeController.svelte';
	import TrackPreview from './player/TrackPreview.svelte';
	import ControlButtons from './player/ControlButtons.svelte';
	import PlayerTrackSlider from './player/LargePlayerTrackSlider.svelte';
	import SmallPlayerTrackSlider from './player/SmallPlayerTrackSlider.svelte';

	const socketConnection = ioClient.connect();

	let broadcastModal = false;
	let SpotifyPlayer: Spotify.Player;
	let timer: NodeJS.Timer;

	let volume = 50;
	let debouncedVolume = 0;

	let playingMs = 0;

	function handleChangeSessionInfo() {
		// if ($currentSession) changeSessionPlayInfo($currentSession, $currentSessionRole, $playingInfo);
	}

	// open broadcast modal, and play send track info
	async function togglePlay() {
		broadcastModal = false;

		if ($currentSessionRole !== 'admin') return;
		if (!$hasConfirmedBroadcast && !broadcastModal) {
			broadcastModal = true;
			return;
		}

		try {
			// const broadcastPayload = createBroadcastPayload($currentSession, $playingInfo);
			// socketConnection.emit('startSessionBroadcast', broadcastPayload);
			console.log($spotifyAccessToken)

			await playTrack(
				$playingInfo,
				$spotifyPlayerDeviceId,
				$currentSessionQueue?.queues ?? [],
				$spotifyAccessToken?.access_token
			);
			await updatePlayInfo($playingInfo, $currentSession, $currentSessionRole);

			timer = setInterval(() => {
				playingMs += 1000;
				if ($currentSessionQueue?.queues && $currentSessionQueue?.queues[0]) {
					playingInfo.set({
						...$currentSessionQueue.queues[0],
						is_playing: true,
						currentDurationMs: playingMs
					});

					if ($playingInfo && playingMs >= $playingInfo?.duration_ms) {
						// TODO: add track
						forwardTrack();
					}
				}
			}, 1000);
		} catch (e) {
			console.log(e);
		}
	}

	async function togglePause() {
		try {
			const _prevInfo = { ...$playingInfo };
			playingInfo.set({ ..._prevInfo, is_playing: false });

			await supabase
				.from('session_queue')
				.update({ is_playing: false })
				.eq('session_id', $currentSession?.id);

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

	async function handleFastForwardTrack() {
		if ($currentSessionRole !== 'admin') return;

		await fastForwardCurrentTrack(
			playingMs,
			$spotifyPlayerDeviceId,
			$spotifyAccessToken?.access_token,
			$playingInfo
		);
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

		if ($currentSessionRole === 'member') {
			socketConnection.on('onStartBoardcast', async (payload: SessionBroadcastRequest) => {
				playingInfo.set({
					...payload
				});
				if (payload.is_playing === true) {
					await togglePlay();
				}
			});

			socketConnection.on('onPauseBoardcast', async () => {
				await togglePause();
			});
		}

		// detectSessionChange($currentSessionRole);
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
			<PlayerTrackSlider {playingMs} {handleFastForwardTrack} />
		</div>
		<VolumeController {volume} {debouncedVolume} {SpotifyPlayer} />
		<div class="absolute right-4 bottom-2">
			<Icon
				id="connected-player"
				icon="material-symbols:speaker-group"
				class="w-4 h-4 text-dark-200"
			/>
		</div>
		<Tooltip triggeredBy="[id=connected-player]" placement="bottom"
			>Connected to {SpotifyPlayer?._options?.name}</Tooltip
		>
	</div>
<SmallPlayerTrackSlider {playingMs} {handleFastForwardTrack} />
</div>
