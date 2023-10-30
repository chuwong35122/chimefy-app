<script lang="ts">
	import { playingInfo } from '$stores/session';
</script>

<div class="h-20">
	{#if $playingInfo && $playingInfo?.name}
		<div class="flex flex-col md:flex-row items-center text-start lg:text-start">
			<img src={$playingInfo?.image_url} alt="Playing track cover" class="w-20 h-20 mr-4" />
			<div class="w-32 overflow-hidden invisible md:visible">
				<p class="text-sm truncate w-28 font-medium">{$playingInfo?.name ?? ''}</p>
				<p class="text-xs truncate w-28 text-dark-200">{$playingInfo?.artist}</p>
			</div>
		</div>
	{/if}
</div>
