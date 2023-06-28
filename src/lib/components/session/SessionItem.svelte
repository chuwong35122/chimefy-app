<script lang="ts">
	import { goto } from '$app/navigation';
	import type { MusicSessionInfo } from '$lib/interfaces/session/session.interface';
	import Icon from '@iconify/svelte';
	import { Popover } from 'flowbite-svelte';

	export let session: MusicSessionInfo;
	export let index = 0;
	export let isPrivate = false;

	function handleSessionNavigate(session: MusicSessionInfo) {
		goto(`/session/${session?.uuid}`);
	}
</script>

<div class="flex items-center">
	{#if session?.session_queue[0]?.queues?.length > 0}
		<Popover title="Now Playing..." triggeredBy={`#track-img-${index}`}>
			<p class="font-semibold text-sm">
				{session?.session_queue[0]?.queues[0]?.track_name}
			</p>
			<p class="text-xs">{session?.session_queue[0]?.queues[0]?.artist}</p>
		</Popover>
	{:else}
		<Popover title="Waiting..." triggeredBy="#waiting-popover">
			<p class="text-sm">Waiting for a queue to be added...</p>
		</Popover>
	{/if}

	<p>{index + 1}</p>

	<div
		on:mouseup={() => handleSessionNavigate(session)}
		class="h-20 flex flex-row items-center ml-4 w-full p-2 pl-4 rounded-xl hover:bg-dark-300/20 duration-150 my-2 relative hover:cursor-pointer overflow-hidden"
	>
		{#if isPrivate}
			<Icon icon="material-symbols:lock" class="w-8 h-8 absolute left-8 z-40 text-primary" />
		{/if}
		{#if session?.session_queue && session?.session_queue[0] && session?.session_queue[0]?.queues && session?.session_queue[0]?.queues[0]?.track_image_url}
			<img
				id={`track-img-${index}`}
				src={session?.session_queue[0].queues[0]?.track_image_url}
				alt="Playing track cover"
				class="w-16 h-16 mr-4 rounded-md"
			/>
		{:else}
			<div id="waiting-popover" class="w-16 h-16 grid place-items-center bg-white/10 rounded-md">
				<Icon icon="material-symbols:hourglass-empty-rounded" class="w-8 h-8" />
			</div>
		{/if}

		<div class="leading-4 ml-4">
			<p class="mr-2 capitalize font-medium ">{session?.name}</p>
			<p class="text-xs text-dark-100">{session.type}</p>
		</div>
	</div>
</div>
