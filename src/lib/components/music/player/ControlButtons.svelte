<script lang="ts">
	import { currentSessionRole, isPlayingStatus } from '$lib/session/session';
	import Icon from '@iconify/svelte';
	import { Tooltip } from 'flowbite-svelte';

	export let onBroadcastSignal: (playing: boolean) => void;
	export let onForwardTrack: () => void;
	export let onBackwardTrack: () => void;

	function togglePlay() {
		onBroadcastSignal(true);
	}

	function togglePause() {
		onBroadcastSignal(false);
	}
</script>

{#if $currentSessionRole === 'member'}
	<Tooltip triggeredBy="#controller-section">Only admin controls the player</Tooltip>
{/if}
<div id="controller-section" class="flex flex-row items-center mb-2">
	<button
		disabled={$currentSessionRole === 'member'}
		on:click={onBackwardTrack}
		class="disabled:text-dark-400"
	>
		<Icon
			icon="material-symbols:skip-previous-rounded"
			class="w-10 h-10 hover:scale-110 duration-100"
		/>
	</button>
	<button
		disabled={$currentSessionRole === 'member'}
		on:click={$isPlayingStatus ? togglePause : togglePlay}
		class="disabled:text-dark-400"
	>
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
	<button
		disabled={$currentSessionRole === 'member'}
		on:click={onForwardTrack}
		class="disabled:text-dark-400"
	>
		<Icon
			icon="material-symbols:skip-next-rounded"
			class="w-10 h-10 hover:scale-110 duration-100"
		/>
	</button>
</div>
