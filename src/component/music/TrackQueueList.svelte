<script lang="ts">
	import { currentSession } from '$lib/session/session';
	// TODO: Create scroll animation
	let imgRef: HTMLImageElement;

	function handleImageError() {
		imgRef.src = '/logo/disc.png';
	}
</script>

<div class="w-full h-full grid place-items-center">
	<!-- Each Queues -->
	{#each $currentSession?.queues as queue}
		<div class="w-[600px] h-[400px] grid place-items-center">
			<div class="w-96 h-96 rounded-2xl overflow-hidden relative cursor-pointer my-8">
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
					<p class="text-lg leading-tight">{queue?.duration}</p>
					<p class="text-2xl font-normal leading-tight">{queue?.trackName}</p>
					<p class="text-sm leading-tight">{queue?.artist}</p>
				</div>
			</div>
		</div>
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
