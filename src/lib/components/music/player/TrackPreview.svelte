<script lang="ts">
	import { playingInfo } from '$lib/session/session';
</script>

<div class="h-20">
	{#if $playingInfo && $playingInfo?.track_image_url}
		<div class="flex flex-col md:flex-row items-center text-start lg:text-start">
			<img
				src={$playingInfo?.track_image_url}
				alt="Playing track cover"
				class="w-20 h-20 mr-4 rounded-md"
			/>
			<div class="w-32 overflow-hidden invisible md:visible">
				<p class="text-sm truncate w-28 font-medium">{$playingInfo?.track_name ?? ''}</p>
				<p class="text-xs truncate w-28 text-dark-200">{$playingInfo?.artist}</p>
			</div>
		</div>
	{/if}
</div>
