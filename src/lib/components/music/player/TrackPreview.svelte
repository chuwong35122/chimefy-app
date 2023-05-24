<script lang="ts">
	import { playingInfo } from '$lib/session/session';
</script>

<div>
	{#if $playingInfo && $playingInfo?.track_image_url}
		<div class="flex flex-col lg:flex-row items-center text-center lg:text-start">
			<img
				src={$playingInfo?.track_image_url}
				alt="Playing track cover"
				class="w-20 h-20 mr-4 rounded-md"
			/>
			<div class="w-32 overflow-hidden">
				<p class="font-medium truncate w-28">{$playingInfo?.track_name ?? ''}</p>
				<p class="text-xs truncate w-28 text-dark-200">{$playingInfo?.artist}</p>
			</div>
		</div>
	{/if}
</div>
