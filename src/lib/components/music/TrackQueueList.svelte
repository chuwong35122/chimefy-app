<script lang="ts">
	import { currentSessionQueue, currentSession } from '$lib/session/session';
	import { millisecondToMinuteSeconds } from '$lib/utils/common/time';
	import Icon from '@iconify/svelte';
	import { Tooltip } from 'flowbite-svelte';
	import type { Record } from 'pocketbase';
	import type { MusicQueue } from '$lib/interfaces/session/queue.interface';
	import { supabase } from '$lib/supabase/supabase';
	// TODO: Create scroll animation
	let imgRef: HTMLImageElement;

	function handleImageError() {
		imgRef.src = '/logo/disc.png';
	}

	let queues: MusicQueue[] = [];
	currentSessionQueue.subscribe((val) => {
		if (val) queues = val?.queues;
	});

	async function removeQueue(index: number) {
		if (!$currentSession || !$currentSessionQueue) return;

		const queues: MusicQueue[] = $currentSessionQueue?.queues;
		queues.splice(index, 1);
		await supabase.from('session_queue').update({ queues }).eq('id', $currentSessionQueue?.id);
	}
</script>

<!-- Each Queues -->
<div class="w-full grid place-items-center">
	{#each queues as queue, i}
		<div class="w-60 h-60 lg:w-96 lg:h-96 rounded-2xl overflow-hidden relative cursor-pointer my-8">
			<div class="gradient-hover-effect" />
			<img
				bind:this={imgRef}
				src={queue?.track_image_url}
				width="400"
				height="400"
				alt={`${queue.track_name} cover`}
				on:error={handleImageError}
				class="object-cover rounded-2xl absolute z-0"
			/>
			<div class="absolute z-20 p-2 bottom-0">
				<p class="leading-tight">
					{millisecondToMinuteSeconds(queue.duration_ms ?? 0)}
				</p>
				<p
					class={`font-medium leading-tight ${
						queue?.track_name.length > 20 ? 'text-lg' : 'text-xl'
					}`}
				>
					{queue?.track_name}
				</p>
				<p class={`${queue?.artist.length > 20 ? 'text-xs' : 'text-sm'} leading-tight`}>
					{queue?.artist}
				</p>
			</div>
			<button
				on:click={() => removeQueue(i)}
				id="delete-btn"
				class="absolute z-20 p-2 top-0 right-0 active:scale-125 duration-150"
			>
				<Icon icon="mdi:trash" class="w-6 h-6 text-dark-200 hover:scale-110 duration-200" />
			</button>
		</div>
	{/each}
	<Tooltip triggeredBy="[id=delete-btn]" placement="right">Remove Queue</Tooltip>
	<!-- Each Queues -->
</div>

<style>
	.gradient-hover-effect {
		width: 100%;
		height: 100%;
		background: linear-gradient(0deg, rgba(255, 255, 255, 0.06), transparent) rgba(0, 0, 0, 0.4);
		transition: background-color 0.5s;
		position: absolute;
		z-index: 20;
	}
	.gradient-hover-effect:hover {
		background: linear-gradient(0deg, rgba(0, 0, 0, 0.8), transparent) rgba(255, 255, 255, 0.1);
	}
</style>
