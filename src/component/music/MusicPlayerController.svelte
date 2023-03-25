<script lang="ts">
	import {
		currentSessionRole,
		currentSession,
		playingInfo,
		SpotifyPlayer
	} from '$lib/session/session';
	import Icon from '@iconify/svelte';
	import { millisecondToMinuteSeconds } from '$lib/utils/common/time';
	import { onMount } from 'svelte';
	import { socket } from '$lib/socket/client';
	import type {
		OnChangePlayingInfoRequest,
		SessionPlayingInfo
	} from '$lib/interfaces/session/session.interface';
	import { spotifyAccessToken } from '$lib/spotify/spotify';
	import { toastValue } from '$lib/notification/toast';
	import { Tooltip } from 'flowbite-svelte';

	let timer: NodeJS.Timer;

	let volume = 0;
	let isPlaying = false;
	let playingMs = 0;

	playingInfo.subscribe((val) => {
		if (val) {
			isPlaying = val.status === 'playing';
		}
	});
	playingInfo.set({
		trackName: 'Flowers',
		artist: 'Miley Cyrus',
		status: 'playing',
		trackId: '0yLdNVWF3Srea0uzk55zFn',
		trackDurationMs: 200454,
		trackCoverImg: 'https://i.scdn.co/image/ab67616d0000b273f429549123dbe8552764ba1d',
		currentDurationMs: 0
	});

	function handleChangeSessionInfo() {
		const changePlayingInfoRequest: OnChangePlayingInfoRequest = {
			playingInfo: $playingInfo,
			sessionId: $currentSession?.id
		};

		socket.emit('onChangePlayingInfo', changePlayingInfoRequest);
	}

	function togglePlay() {
		isPlaying = true;

		const _playingInfo = $playingInfo;
		_playingInfo.status = 'playing';
		handleChangeSessionInfo();

		timer = setInterval(() => {
			playingMs += 1000;
			playingInfo.set({
				trackName: 'Flowers',
				artist: 'Miley Cyrus',
				status: 'playing',
				trackId: '0yLdNVWF3Srea0uzk55zFn',
				trackDurationMs: 200454,
				currentDurationMs: playingMs,
				trackCoverImg: 'https://i.scdn.co/image/ab67616d0000b273f429549123dbe8552764ba1d'
			});
			if ($playingInfo && playingMs >= $playingInfo?.trackDurationMs) {
				// go new track
			}
		}, 1000);
	}

	function togglePause() {
		isPlaying = false;
		const _prevInfo = { ...$playingInfo };
		playingInfo.set({ ..._prevInfo, status: 'pause' });
		handleChangeSessionInfo();
		clearInterval(timer);
	}

	// request for current playing music
	onMount(async () => {
		window.onSpotifyWebPlaybackSDKReady = () => {
			const token = $spotifyAccessToken ?? '';
			const player = new Spotify.Player({
				name: 'Unnamed App',
				getOAuthToken: (cb) => {
					cb(token);
				},
				volume: 0.5
			});
			player.connect();
			SpotifyPlayer.set(player);
			$SpotifyPlayer.on('ready', () => {
				toastValue.set({ message: 'Spotify Player is ready! 🎧', type: 'info' });
			});
			$SpotifyPlayer.on('authentication_error', (e) => {
				console.log(e);
			});
		};

		socket.on('handleChangePlayingInfo', (info: SessionPlayingInfo) => {
			playingInfo.set(info);
			if ($currentSessionRole === 'member') {
				if (info.status === 'playing') {
					togglePlay();
				} else {
					togglePause();
				}
			}
		});
	});
</script>

<div class='relative w-full p-4 rounded-xl bg-dark-500 hover:bg-white/10 duration-200'>
	<div
	class="flex flex-row items-center justify-between"
>
	{#if $playingInfo && $playingInfo?.trackCoverImg}
		<div class="flex flex-col lg:flex-row items-center text-center lg:text-start">
			<img
				src={$playingInfo.trackCoverImg}
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
			<button on:click={isPlaying ? togglePause : togglePlay}>
				{#if isPlaying}
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
		<div class="flex flex-row items-center w-full justify-between my-[-8px]">
			<div class="text-xs hidden lg:block">{millisecondToMinuteSeconds(playingMs)}</div>
			<input type="range" class="w-[500px] h-8 accent-primary-500 mx-2 hidden lg:block" />
			<div class="text-xs hidden lg:block">
				{millisecondToMinuteSeconds($playingInfo?.trackDurationMs ?? 0)}
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
			<input bind:value={volume} type="range" id="volume-sider" class="accent-white w-16 md:w-24" />
		</div>
	</div>
	<div class="absolute right-4 bottom-2">
		<Icon id='connected-player' icon='material-symbols:speaker-group' class='w-4 h-4 text-dark-200' />
	</div>
	<Tooltip triggeredBy="[id=connected-player]" placement='bottom'>Connected to {$SpotifyPlayer?._options?.name}</Tooltip>
	
</div>
<div class="grid place-items-center mt-4">
	<div class="w-[300px] md:w-[560px] flex flex-row items-center justify-between">
		<div class="text-xs lg:hidden block">{millisecondToMinuteSeconds(playingMs)}</div>
		<div class="text-xs lg:hidden block">
			{millisecondToMinuteSeconds($playingInfo?.trackDurationMs ?? 0)}
		</div>
	</div>
	<input type="range" class="lg:hidden w-[300px] md:w-[560px] h-8 accent-primary-500 mx-2 block" />
</div>
</div>

