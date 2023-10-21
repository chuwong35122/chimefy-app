<script lang="ts">
	import { playingInfo } from '$stores/session';
	import { millisecondToMinuteSeconds } from '$lib/utils/common/time';
	import Icon from '@iconify/svelte';
	import { Tooltip } from 'flowbite-svelte';
	import type { MusicQueue } from '$lib/interfaces/session/queue.interface';
	import { fade, fly } from 'svelte/transition';
	import DebugText from '$components/debugger/DebugText.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { spaceStore } from '$stores/space';

	export let supabase: SupabaseClient;

	let imgRef: HTMLImageElement;
	let queues: MusicQueue[] = [];

	function handleImageError() {
		imgRef.src = '/logo/disc.png';
	}

	spaceStore.subscribe((space) => {
		if (space && space?.queues) {
			queues = space?.queues
		}
	});

	async function removeQueue(index: number) {
		if (!$spaceStore || !$spaceStore) return;

		const queues: MusicQueue[] = $spaceStore?.queues;
		if (queues.length > 0) {
			queues.splice(index, 1);
		}
		await supabase.from('session').update({ queues }).eq('id', $spaceStore?.id);
	}
</script>

<!-- Each Queues -->
<div class="w-full grid place-items-center overflow-x-hidden px-2">
	{#each queues as queue, i}
		<Tooltip triggeredBy={`[id=delete-btn-${i + 1}]`} placement="right">Remove Queue</Tooltip>
		<div
			in:fly={{ duration: 200, x: 200 }}
			out:fade={{ duration: 200 }}
			class={`mb-1 flex flex-row items-center w-full relative cursor-pointer h-20 hover:bg-black duration-200 rounded-md ${
				queue?.track_uri === $playingInfo?.track_uri ? 'bg-white/10' : null
			}`}
		>
			<p class="mx-2">{i + 1}</p>
			<div class="p-2 overflow-hidden font-normal flex flex-row items-center w-full">
				<img
					bind:this={imgRef}
					src={queue?.track_image_url}
					width="60"
					height="60"
					alt={`${queue?.track_name} cover`}
					on:error={handleImageError}
					class="object-cover mr-2"
				/>
				<div class="text-ellipsis w-[80%]">
					<p class="text-sm font-medium">{queue.track_name}</p>
					<DebugText text={queue?.track_id} />
					<p class="leading-tight text-dark-100 text-xs">
						{queue?.artist}
					</p>
					<p class="leading-tight text-dark-100 text-[11px] font-light">
						{millisecondToMinuteSeconds(queue.duration_ms)}
					</p>
				</div>
				{#if queue?.track_uri !== $playingInfo?.track_uri}
					<button
						on:click={() => removeQueue(i)}
						id={`delete-btn-${i + 1}`}
						aria-label="Remove this queue"
						class="absolute z-20 p-2 top-4 right-0 active:scale-125 duration-150"
					>
						<Icon icon="mdi:trash" class="w-6 h-6 text-dark-200 hover:scale-110 duration-200" />
					</button>
				{/if}
			</div>
		</div>
	{/each}
</div>
<!-- Each Queues -->
