<script lang="ts">
	import { playingInfo } from '$stores/player';
	import { millisecondToMinuteSeconds } from '$lib/utils/common/time';
	import Icon from '@iconify/svelte';
	import type { MusicQueue } from '$lib/types/space/queue.interface';
	import { fade, fly } from 'svelte/transition';
	import DebugText from '$components/debugger/DebugText.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { spaceStore } from '$stores/space';
	import { Badge } from 'flowbite-svelte';

	export let supabase: SupabaseClient;

	let imgRef: HTMLImageElement;
	let queues: MusicQueue[] = [];

	function handleImageError() {
		imgRef.src = '/logo/disc.png';
	}

	spaceStore.subscribe((space) => {
		if (space && space?.queues) {
			queues = space?.queues;
		}
	});

	async function removeQueue(index: number) {
		if (!$spaceStore || !$spaceStore) return;

		const queues: MusicQueue[] = $spaceStore?.queues;
		if (queues.length > 0) {
			queues.splice(index, 1);
		}
		await supabase.from('space').update({ queues }).eq('id', $spaceStore?.id);
	}
</script>

<!-- Each Queues -->
<div class="w-full h-[500px] overflow-y-auto grid place-items-center overflow-x-hidden">
	{#each queues as queue, i}
		<div
			in:fly={{ duration: 200, x: 200 }}
			out:fade={{ duration: 200 }}
			class={`mb-1 flex flex-row items-center w-full relative cursor-pointer h-20 hover:bg-black duration-200 rounded-md group ${
				queue?.uri === $playingInfo?.uri ? 'bg-white/10' : null
			}`}
		>
			<p class="mx-2">{i + 1}</p>
			<div class="p-2 overflow-hidden font-normal flex flex-row items-center w-full">
				<img
					bind:this={imgRef}
					src={queue?.image_url}
					width="60"
					height="60"
					alt={`${queue?.name} cover`}
					on:error={handleImageError}
					class="object-cover mr-2"
				/>
				<div class="text-ellipsis w-[80%]">
					<div class="flex flex-row gap-2 mb-1">
						{#if queue.playlist_id}
							<Badge rounded color="green" class='text-xs py-0.5 px-1'>Playlist</Badge>
						{/if}
						<p class="text-sm font-medium line-clamp-1">{queue.name}</p>
					</div>
					<DebugText text={queue?.id} />
					<p class="leading-tight text-dark-100 text-xs">
						{queue?.artist}
					</p>
					<p class="leading-tight text-dark-100 text-[11px] font-light">
						{millisecondToMinuteSeconds(queue.duration_ms)}
					</p>
				</div>
				{#if queue?.uri !== $playingInfo?.uri}
					<button
						on:click={() => removeQueue(i)}
						aria-label="Remove this queue"
						class="absolute z-20 p-2 top-5 right-4 active:scale-125 duration-150 hidden group-hover:block"
					>
						<Icon
							icon="material-symbols:close"
							class="w-6 h-6 text-dark-200 hover:scale-110 hover:text-primary-700 duration-200"
						/>
					</button>
				{/if}
			</div>
		</div>
	{/each}
</div>
<!-- Each Queues -->
