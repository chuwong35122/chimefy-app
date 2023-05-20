<script lang="ts">
	import {
		currentSessionRole,
		currentSession,
		currentSessionQueue,
		playingInfo,
		spotifyPlayerDeviceId,
		hasConfirmedBroadcast,
	} from '$lib/session/session';
	import Icon from '@iconify/svelte';
	import { millisecondToMinuteSeconds } from '$lib/utils/common/time';
	import { onDestroy, onMount } from 'svelte';
	import { spotifyAccessToken, spotifyPlayerId, spotifyUser } from '$lib/spotify/spotify';
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
	import type { MusicSession } from '$lib/interfaces/session/session.interface';
	import { toastValue } from '$lib/notification/toast';
	import { ioClient } from '$lib/socket/client';
	import type { SessionBroadcastRequest } from '$lib/interfaces/session/socket.interface';
	import { createBroadcastPayload } from '$lib/session/track';
	import { supabase } from '$lib/supabase/supabase';
	import type { MusicQueue } from '$lib/interfaces/session/queue.interface';

	const socketConnection = ioClient.connect();

	let broadcastModal = false;
	let SpotifyPlayer: Spotify.Player;
	let timer: NodeJS.Timer;

	let debounceVolumeTimer: NodeJS.Timer;
	let volume = 50;
	let debouncedVolume = 0;

	let playingMs = 0;

	async function debounceSetVolume() {
		clearTimeout(debounceVolumeTimer);
		debounceVolumeTimer = setTimeout(async () => {
			debouncedVolume = volume / 100;
			await SpotifyPlayer.setVolume(debouncedVolume);
		}, 300);
	}

	function handleChangeSessionInfo() {
		if ($currentSession) changeSessionPlayInfo($currentSession, $currentSessionRole, $playingInfo);
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

	$: console.log($playingInfo)

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
				console.log(val);
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
<div class="relative w-full p-4 rounded-xl bg-dark-500 hover:bg-white/10 duration-200">
	<div class="flex flex-row items-center justify-between">
		{#if $playingInfo && $playingInfo?.track_image_url}
			<div class="flex flex-col lg:flex-row items-center text-center lg:text-start">
				<img
					src={$playingInfo?.track_image_url}
					alt="Playing track cover"
					class="w-16 h-16 rounded-full mr-4"
				/>
				<div class="w-32 overflow-hidden">
					<p class="font-medium truncate w-28">{$playingInfo?.track_name ?? ''}</p>
					<p class="text-xs truncate w-28 text-dark-200">{$playingInfo?.artist}</p>
				</div>
			</div>
		{:else}
			<div class="w-20 h-16" />
		{/if}
		<div class="flex flex-col items-center">
			{#if $currentSessionRole === 'admin'}
				<div class="flex flex-row items-center mb-2">
					<button>
						<Icon
							icon="material-symbols:skip-previous-rounded"
							class="w-10 h-10 hover:scale-110 duration-100"
						/>
					</button>
					<button on:click={$playingInfo?.is_playing ? togglePause : togglePlay}>
						{#if $playingInfo && $playingInfo?.is_playing}
							<Icon
								icon="material-symbols:pause-circle-rounded"
								class="w-10 h-10 hover:scale-110 duration-100"
							/>
						{:else}
							<Icon
								icon="material-symbols:play-circle-rounded"
								class="w-10 h-10 hover:scale-110 duration-100"
							/>
						{/if}
					</button>
					<button>
						<Icon
							icon="material-symbols:skip-next-rounded"
							class="w-10 h-10 hover:scale-110 duration-100"
						/>
					</button>
				</div>
			{/if}
			{#if $playingInfo?.is_playing}
				<div class="flex flex-row items-center w-full justify-between my-[-8px]">
					<div class="text-xs hidden lg:block w-8">{millisecondToMinuteSeconds(playingMs)}</div>
					<input
						min={0}
						bind:value={playingMs}
						max={$playingInfo?.duration_ms ?? 1}
						on:mouseup={handleFastForwardTrack}
						type="range"
						class="w-[500px] h-8 accent-primary-500 mx-2 hidden lg:block"
					/>
					<div class="text-xs hidden lg:block w-8">
						{millisecondToMinuteSeconds($playingInfo?.duration_ms ?? 0)}
					</div>
				</div>
			{/if}
		</div>
		<div class="flex flex-row items-center">
			{#if volume === 0}
				<Icon icon="material-symbols:volume-mute-rounded" class="w-6 h-6" />
			{:else if volume > 0 && volume < 60}
				<Icon icon="material-symbols:volume-down-rounded" class="w-6 h-6" />
			{:else if volume >= 60}
				<Icon icon="material-symbols:volume-up-rounded" class="w-6 h-6" />
			{/if}
			<div class="flex flex-col items-center justify-around">
				<input
					bind:value={volume}
					on:keyup={debounceSetVolume}
					type="range"
					id="volume-sider"
					class="accent-white w-16 md:w-24"
				/>
			</div>
		</div>
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
	{#if $playingInfo?.is_playing === true}
		<div class="grid place-items-center mt-4">
			<div class="w-[300px] md:w-[560px] flex flex-row items-center justify-between">
				<div class="text-xs lg:hidden block w-8">{millisecondToMinuteSeconds(playingMs)}</div>
				<div class="text-xs lg:hidden block w-8">
					{millisecondToMinuteSeconds($playingInfo?.duration_ms ?? 0)}
				</div>
			</div>
			<input
				bind:value={playingMs}
				min={0}
				max={$playingInfo?.duration_ms ?? 1}
				on:mouseup={handleFastForwardTrack}
				type="range"
				class="lg:hidden w-[300px] md:w-[560px] h-8 accent-primary-500 mx-2 block"
			/>
		</div>
	{/if}
</div>
