<script lang="ts">
	import { goto } from '$app/navigation';
	import type { MusicSessionInfo } from '$lib/types/session/session.interface';
	import Icon from '@iconify/svelte';
	import { Badge } from 'flowbite-svelte';

	export let space: MusicSessionInfo;
	export let index = 0;
	export let isPrivate = false;

	function handleSessionNavigate(session: MusicSessionInfo) {
		goto(`/session/${session?.uuid}`);
	}
</script>

<div
	class="flex flex-col items-center justify-between w-52 h-88 rounded-md bg-dark-400/10 hover:bg-dark-400/20 duration-150 overflow-hidden"
>
	<button type="button" on:click={() => handleSessionNavigate(space)}>
		<div class="h-52 aspect-square overflow-hidden p-3">
			{#if space?.session_queue && space?.session_queue[0] && space?.session_queue[0]?.queues && space?.session_queue[0]?.queues[0]?.image_url}
				<img
					id={`track-img-${index}`}
					src={space?.session_queue[0].queues[0]?.image_url}
					alt="Playing track cover"
					class="object-cover"
				/>
			{:else}
				<img
					id={`track-img-${index}`}
					src="/images/placeholders/blend.avif"
					alt="Playing track placeholder cover"
					class="object-cover -hue-rotate-60"
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

			<p class="capitalize font-medium text-ellipsis break-words my-2">{space?.name}</p>
			<p class="text-sm text-dark-200">Lorem ipsum dolor sit amet consectetur</p>
		</div>
	</button>
</div>
