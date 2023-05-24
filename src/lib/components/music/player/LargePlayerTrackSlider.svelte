<script lang="ts">
	import { playingInfo } from '$lib/session/session';
	import { millisecondToMinuteSeconds } from '$lib/utils/common/time';

	export let playingMs = 0;
	export let handleFastForwardTrack: (e: MouseEvent) => void;
</script>

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
