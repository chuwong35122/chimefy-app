<script lang="ts">
	import { millisecondToMinuteSeconds } from '$lib/utils/common/time';

	import { playingInfo } from '../../../session/session';

	export let playingMs = 0;
	export let handleFastForwardTrack: (e: MouseEvent) => void;
</script>

<div>
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
