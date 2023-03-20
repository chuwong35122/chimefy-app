<script lang="ts">
	import type { MusicSessionQueue } from '$lib/interfaces/session/session.interface';
	import { playingInfo, currentSession } from '$lib/session/session';
	import { onMount } from 'svelte';
	import { Tooltip } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import { calculatePercentageFromTime, millisecondToMinuteSeconds, minuteSecondsToTime, zeroPad } from '$lib/utils/common/time';

	let volume = 0;
	let playingTrackId = '';
	let playingTrackInfo: MusicSessionQueue;

  let playingMinutes = 0;
  let playingSeconds = 0

	playingInfo.subscribe((info) => {
		if (info) {
			playingTrackId = info.trackId;
		}
	});

	currentSession.subscribe((session) => {
		if (!playingTrackId) return;
		const queue = session.queues.find((queue) => queue.trackId === playingTrackId);
		if (queue) {
			playingTrackInfo = queue;
		}
	});

	onMount(() => {
		playingInfo.set({
			status: 'playing',
			trackId: '4iZ4pt7kvcaH6Yo8UoZ4s2',
			trackDurationMinutes: 3,
			trackDurationSeconds: 22,
			currentDurationMinutes: 0,
			currentDurationSeconds: 0
		});
	});
</script>

<div class="w-full h-full p-4 rounded-full bg-dark-500 flex flex-row items-center justify-between">
	{#if playingTrackInfo && playingTrackInfo?.trackImageUrl}
		<div class="flex flex-row items-center">
			<img
				src={playingTrackInfo.trackImageUrl}
				alt="Playing track cover"
				class="w-16 h-16 rounded-full mr-4"
			/>
			<div class="w-44 overflow-hidden">
				<p class="font-medium">{playingTrackInfo?.trackName ?? ''}</p>
				<p class="text-xs truncate w-40 text-dark-200">{playingTrackInfo.artist}</p>
			</div>
		</div>
	{/if}

	<div>
		<input type="range" class="w-[540px] h-8 accent-primary-500" />
		<div class="flex flex-row items-center w-full justify-between my-[-8px]">
			<div class="text-xs">{zeroPad(playingMinutes, 2) ?? 0}:{zeroPad(playingSeconds, 2) ?? 0}</div>
			<div class="text-xs">
				{minuteSecondsToTime(playingTrackInfo?.durationMinutes, playingTrackInfo?.durationSeconds)}
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
