<script lang="ts">
	import { currentSession } from '$lib/session/session';
	import { socket } from '$lib/socket/client';
	import { millisecondToMinuteSeconds, minuteSecondsToTime } from '$lib/utils/common/time';
	import { onDestroy, onMount } from 'svelte';
	import { toastValue } from '$lib/notification/toast';
	// TODO: Create scroll animation
	let imgRef: HTMLImageElement;

	let minutes = '';
	let seconds = ''
	function handleImageError() {
		imgRef.src = '/logo/disc.png';
	}

	onMount(() => {
		socket.on('onQueueAdded', (message: string) => {
			toastValue.set({message: message, type: 'info'})
		})
	})
	
	onDestroy(() => {
		socket.off('onQueueAdded')
	})
</script>

<!-- Each Queues -->
<div class="w-full grid place-items-center">
	{#each $currentSession?.queues as queue}
		<!-- <div class="w-[600px] h-[400px] grid place-items-center"> -->
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
					<p class="text-2xl font-normal leading-tight">{queue?.trackName}</p>
					<p class="text-sm leading-tight">{queue?.artist}</p>
				</div>
			</div>
		<!-- </div> -->
	{/each}
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
