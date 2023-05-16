<script lang="ts">
	import { currentSession } from '$lib/session/session';
	import { millisecondToMinuteSeconds } from '$lib/utils/common/time';
	import { onDestroy, onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { Tooltip } from 'flowbite-svelte';
	import type { MusicSession } from '$lib/interfaces/session/session.interface';
	import { pb } from '$lib/pocketbase/pb';
	import type { Record } from 'pocketbase';
	import { supabase } from '$lib/supabase/supabase';
	// TODO: Create scroll animation
	let imgRef: HTMLImageElement;

	function handleImageError() {
		imgRef.src = '/logo/disc.png';
	}

	async function removeQueue(index: number) {
		if (!$currentSession || !$currentSession?.uuid) return;

		const _currentSession = $currentSession;
		const queues = _currentSession.queues;
		queues.splice(index, 1);
		await supabase.from('session').update(_currentSession).eq('uuid', _currentSession?.uuid)
	}
</script>

<!-- Each Queues -->
<div class="w-full grid place-items-center">
	{#each $currentSession?.queues as queue, i}
		<div class="w-60 h-60 lg:w-96 lg:h-96 rounded-2xl overflow-hidden relative cursor-pointer my-8">
			<div class="gradient-hover-effect" />
			<img
				bind:this={imgRef}
				src={queue?.trackImageUrl}
				width="400"
				height="400"
				alt={`${queue.trackName} cover`}
				on:error={handleImageError}
				class="object-cover rounded-2xl absolute z-0"
			/>
			<div class="absolute z-20 p-2 bottom-0">
				<p class="leading-tight">
					{millisecondToMinuteSeconds(queue.durationMs ?? 0)}
				</p>
				<p
					class={`font-medium leading-tight ${
						queue?.trackName.length > 20 ? 'text-lg' : 'text-xl'
					}`}
				>
					{queue?.trackName}
				</p>
				<p class={`${queue?.artist.length > 20 ? 'text-xs' : 'text-sm'} leading-tight`}>
					{queue?.artist}
				</p>
			</div>
			<button
				on:click={() => removeQueue(i)}
				id="delete-btn"
				class="absolute z-20 p-2 top-0 right-0"
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
