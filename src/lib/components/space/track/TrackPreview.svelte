<script lang="ts">
	import { playingInfo } from '$stores/player';
</script>

<div class="h-20">
	{#if $playingInfo && $playingInfo?.name}
		<div class="flex flex-row items-center text-start w-full">
			<img src={$playingInfo?.image_url} alt="Playing track cover" class="w-20 h-20 mr-4" />
			<div>
				<p class="text-sm font-medium line-clamp-2">{$playingInfo?.name ?? ''}</p>
				<p class="text-xs truncate text-dark-200">{$playingInfo?.artist}</p>
			</div>
		</div>
	{/if}
</div>
