<script lang="ts">
	import type { MusicSpace } from '$lib/types/space/space.interface';
	import Icon from '@iconify/svelte';
	import { Badge } from 'flowbite-svelte';

	export let space: MusicSpace;
	export let index = 0;
	export let isPrivate = false;
</script>

<div
	class="flex flex-col items-center justify-between w-52 h-[360px] rounded-md bg-dark-400/40 hover:scale-105 duration-150 overflow-hidden"
>
	<a href={`/space/${space.uuid}`} type="button">
		<div class="h-52 aspect-square overflow-hidden p-3">
			{#if space?.queues && space?.queues[0] && space?.queues[0]?.image_url}
				<img
					id={`track-img-${index}`}
					src={space?.queues[0]?.image_url}
					alt="Playing track cover"
					class="object-cover w-full h-full"
				/>
			{:else}
				<img
					id={`track-img-${index}`}
					src={space?.cover_image}
					alt="Playing track placeholder cover"
					class="object-cover w-full h-full"
				/>
			{/if}
		</div>
		<div class="leading-6 text-start p-3 w-52 text-ellipsis">
			<div class="flex flex-row items-center gap-2">
				<Badge color="dark" class="rounded-full text-xs">{space.type}</Badge>
				{#if isPrivate}
					<Icon icon="ic:round-lock" width={14} height={14} />
				{/if}
			</div>
			<p class="capitalize text-sm font-medium text-ellipsis break-words my-2 line-clamp-2">
				{space?.name}
			</p>
			{#if space.description}
				<p class="text-xs text-dark-200 line-clamp-3">{space?.description}</p>
			{/if}
		</div>
	</a>
</div>
