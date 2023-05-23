<script lang="ts">
	import { currentSessionQueue, currentSession } from '$lib/session/session';
	import { millisecondToMinuteSeconds } from '$lib/utils/common/time';
	import Icon from '@iconify/svelte';
	import { Tooltip } from 'flowbite-svelte';
	import type { MusicQueue } from '$lib/interfaces/session/queue.interface';
	import { supabase } from '$lib/supabase/supabase';
	// TODO: Create scroll animation
	let imgRef: HTMLImageElement;

	function handleImageError() {
		imgRef.src = '/logo/disc.png';
	}

	let queues: MusicQueue[] = [];
	console.log(queues);
	currentSessionQueue.subscribe((val) => {
		if (val && val?.queues) {
			queues = val?.queues ?? [];
		}
	});

	async function removeQueue(index: number) {
		if (!$currentSession || !$currentSessionQueue) return;

		const queues: MusicQueue[] = $currentSessionQueue?.queues;
		if (queues.length > 0) {
			queues.splice(index, 1);
		}
		await supabase.from('session_queue').update({ queues }).eq('id', $currentSessionQueue?.id);
	}
</script>

<!-- Each Queues -->
<div class="w-full grid place-items-center overflow-x-hidden">
	{#each queues as queue, i}
		<div
			class="flex flex-row items-center w-full relative cursor-pointer h-20 hover:bg-black duration-200 rounded-md"
		>
			<p class="mx-2">{i + 1}</p>
			<div class="rounded-2xl p-2 overflow-hidden font-normal flex flex-row items-center w-full">
				<img
					bind:this={imgRef}
					src={queue?.track_image_url}
					width="60"
					height="60"
					alt={`${queue?.track_name} cover`}
					on:error={handleImageError}
					class="object-cover rounded-md mr-2"
				/>
				<div class="text-ellipsis w-[80%]">
					<p class="text-sm">{queue.track_name}</p>
					<p class="leading-tight text-dark-100 text-xs">
						{queue?.artist}
					</p>
				</div>
				<button
					on:click={() => removeQueue(i)}
					id="delete-btn"
					class="absolute z-20 p-2 top-4 right-0 active:scale-125 duration-150"
				>
					<Icon icon="mdi:trash" class="w-6 h-6 text-dark-200 hover:scale-110 duration-200" />
				</button>
			</div>
		</div>
	{/each}
	<Tooltip triggeredBy="[id=delete-btn]" placement="right">Remove Queue</Tooltip>
</div>
<!-- Each Queues -->
