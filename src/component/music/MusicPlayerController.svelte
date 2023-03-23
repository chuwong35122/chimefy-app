<script lang="ts">
	import { checkSessionRole, currentSession, playingInfo } from '$lib/session/session';
	import Icon from '@iconify/svelte';
	import { millisecondToMinuteSeconds } from '$lib/utils/common/time';
	import { onMount } from 'svelte';
	import {user} from '$lib/pocketbase/pb'
	import { socket } from '$lib/socket/client';

	let timer: NodeJS.Timer;

	let isPlaying = false;
	let volume = 0;
	let playingMs = 0;
	playingInfo.set({
		trackName: 'Flowers',
		artist: 'Miley Cyrus',
		status: 'playing',
		trackId: '0yLdNVWF3Srea0uzk55zFn',
		trackDurationMs: 200454,
		trackCoverImg: 'https://i.scdn.co/image/ab67616d0000b273f429549123dbe8552764ba1d'
	});

	function togglePlay() {
		isPlaying = true;
		if (isPlaying) {
			timer = setInterval(() => {
				playingMs += 1000;
				if ($playingInfo && playingMs >= $playingInfo?.trackDurationMs) {
					// go new track
				}
			}, 1000);
		}
	}

	function togglePause() {
		isPlaying = false;
		clearInterval(timer);
	}

	// request for current playing music
</script>

<div
	class="w-full h-full p-4 rounded-xl bg-dark-500 flex flex-row items-center justify-between hover:bg-white/10 duration-200"
>
	{#if $playingInfo && $playingInfo?.trackCoverImg}
		<div class="flex flex-row items-center">
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
			<div class="text-xs">{millisecondToMinuteSeconds(playingMs)}</div>
			<input type="range" class="w-[500px] h-8 accent-primary-500 mx-2" />
			<div class="text-xs">
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
		<input bind:value={volume} type="range" id="volume-sider" class="accent-white w-24" />
	</div>
</div>
