<script lang="ts">
	import {
		currentSessionRole,
		currentSession,
		playingInfo,
		checkSessionRole,
		spotifyPlayerDeviceId
	} from '$lib/session/session';
	import Icon from '@iconify/svelte';
	import { millisecondToMinuteSeconds } from '$lib/utils/common/time';
	import { onDestroy, onMount } from 'svelte';
	import { socket } from '$lib/socket/client';
	import type {
		OnChangePlayingInfoRequest,
		SessionPlayingInfo
	} from '$lib/interfaces/session/session.interface';
	import { spotifyAccessToken } from '$lib/spotify/spotify';
	import { toastValue } from '$lib/notification/toast';
	import { Tooltip } from 'flowbite-svelte';
	import {
		changeSessionPlayInfo,
		detectSessionChange,
		forwardTrack,
		playTrack,
		updatePlayInfo
	} from '$lib/spotify/player';

	let SpotifyPlayer: Spotify.Player;
	let timer: NodeJS.Timer;
	let debounceTimer: NodeJS.Timer;

	let volume = 50;
	let debouncedVolume = 0;
	let playingMs = 0;

	async function debounceSetVolume() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(async () => {
			debouncedVolume = volume / 100;
			await SpotifyPlayer.setVolume(debouncedVolume);
		}, 300);
	}

	function handleChangeSessionInfo() {
		if ($currentSession) changeSessionPlayInfo($currentSession, $currentSessionRole, $playingInfo);
	}

	async function togglePlay() {
		if (!$currentSession || !$currentSessionRole || !playingInfo || !spotifyPlayerDeviceId) return;

		await playTrack($playingInfo, $spotifyPlayerDeviceId, $currentSession);
		updatePlayInfo($playingInfo, $currentSession, $currentSessionRole);

		timer = setInterval(() => {
			playingMs += 1000;
			if ($currentSession?.queues && $currentSession?.queues[0]) {
				playingInfo.set({
					...$currentSession.queues[0],
					status: 'playing',
					currentDurationMs: playingMs
				});
			}
			if ($playingInfo && playingMs >= $playingInfo?.currentDurationMs) {
				// TODO: add track
				forwardTrack();
			}
		}, 1000);
	}

	async function togglePause() {
		const _prevInfo = { ...$playingInfo };
		playingInfo.set({ ..._prevInfo, status: 'pause' });
		await fetch('/api/spotify/playback/pause', {
			body: JSON.stringify({
				device_id: $spotifyPlayerDeviceId,
				access_token: $spotifyAccessToken
			})
		});
		handleChangeSessionInfo();
		clearInterval(timer);
	}

	// request for current playing music
	onMount(async () => {
		window.onSpotifyWebPlaybackSDKReady = () => {
			const token = $spotifyAccessToken ?? '';
			SpotifyPlayer = new Spotify.Player({
				name: 'Chimefy Player',
				getOAuthToken: (cb) => {
					cb(token);
				},
				volume: 0.5
			});
			SpotifyPlayer.connect();
			SpotifyPlayer.on('ready', async ({ device_id }) => {
				spotifyPlayerDeviceId.set(device_id);
				toastValue.set({ message: 'Spotify Player is ready! 🎧', type: 'info' });
				await playTrack($playingInfo, device_id, $currentSession)
			});
		};

		detectSessionChange($currentSessionRole);
	});

	onDestroy(() => {
		SpotifyPlayer?.disconnect();
	});
</script>

<svelte:head>
	<title>Session - {$currentSession.name}</title>
	<script src="https://sdk.scdn.co/spotify-player.js"></script>
</svelte:head>

<div class="relative w-full p-4 rounded-xl bg-dark-500 hover:bg-white/10 duration-200">
	<div>{JSON.stringify(playingInfo)}</div>
	<div class="flex flex-row items-center justify-between">
		{#if $playingInfo && $playingInfo?.trackImageUrl}
			<div class="flex flex-col lg:flex-row items-center text-center lg:text-start">
				<img
					src={$playingInfo.trackImageUrl}
					alt="Playing track cover"
					class="w-16 h-16 rounded-full mr-4"
				/>
				<div class="w-32 overflow-hidden">
					<p class="font-medium truncate w-28">{$playingInfo?.trackName ?? ''}</p>
					<p class="text-xs truncate w-28 text-dark-200">{$playingInfo?.artist}</p>
				</div>
			</div>
		{/if}

		<div class="flex flex-col items-center">
			<div class="flex flex-row items-center mb-2">
				<button>
					<Icon
						icon="material-symbols:skip-previous-rounded"
						class="w-10 h-10 hover:scale-110 duration-100"
					/>
				</button>
				<button on:click={$playingInfo?.status === 'playing' ? togglePause : togglePlay}>
					{#if $playingInfo && $playingInfo?.status !== 'playing'}
						<Icon
							icon="material-symbols:play-circle-rounded"
							class="w-10 h-10 hover:scale-110 duration-100"
						/>
					{:else}
						<Icon
							icon="material-symbols:pause-circle-rounded"
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
			<div class="flex flex-row items-center w-full justify-between my-[-8px]">
				<div class="text-xs hidden lg:block">{millisecondToMinuteSeconds(playingMs)}</div>
				<input type="range" class="w-[500px] h-8 accent-primary-500 mx-2 hidden lg:block" />
				<div class="text-xs hidden lg:block">
					{millisecondToMinuteSeconds($playingInfo?.durationMs ?? 0)}
				</div>
			</div>
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
	<div class="grid place-items-center mt-4">
		<div class="w-[300px] md:w-[560px] flex flex-row items-center justify-between">
			<div class="text-xs lg:hidden block">{millisecondToMinuteSeconds(playingMs)}</div>
			<div class="text-xs lg:hidden block">
				{millisecondToMinuteSeconds($playingInfo?.durationMs ?? 0)}
			</div>
		</div>
		<input
			type="range"
			class="lg:hidden w-[300px] md:w-[560px] h-8 accent-primary-500 mx-2 block"
		/>
	</div>
</div>
