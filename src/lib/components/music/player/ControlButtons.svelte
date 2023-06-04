<script lang="ts">
	import { currentSessionRole, isPlayingStatus } from '$lib/session/session';
	import Icon from '@iconify/svelte';

	export let onBroadcastSignal: (playing: boolean) => void;
	export let onForwardTrack: () => void;
	export let onBackwardTrack: () => void;

	function togglePlay() {
		onBroadcastSignal(true)
	}

	function togglePause() {
		onBroadcastSignal(false)
	}
</script>

<div>
	{#if $currentSessionRole === 'admin'}
		<div class="flex flex-row items-center mb-2">
			<button on:click={onBackwardTrack}>
				<Icon
					icon="material-symbols:skip-previous-rounded"
					class="w-10 h-10 hover:scale-110 duration-100"
				/>
			</button>
			<button on:click={$isPlayingStatus ? togglePause : togglePlay}>
				{#if $isPlayingStatus}
					<Icon
						icon="material-symbols:pause-circle-rounded"
						class="w-10 h-10 hover:scale-110 duration-100"
					/>
				{:else}
					<Icon
						icon="material-symbols:play-circle-rounded"
						class="w-10 h-10 hover:scale-110 duration-100"
					/>
				{/if}
			</button>
			<button on:click={onForwardTrack}>
				<Icon
					icon="material-symbols:skip-next-rounded"
					class="w-10 h-10 hover:scale-110 duration-100"
				/>
			</button>
		</div>
	{/if}
</div>
