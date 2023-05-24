<script lang="ts">
	import { currentSessionRole, playingInfo } from '$lib/session/session';
	import Icon from '@iconify/svelte';

	export let togglePlay: () => void;
	export let togglePause: () => void;
</script>

<div>
	{#if $currentSessionRole === 'admin'}
		<div class="flex flex-row items-center mb-2">
			<button>
				<Icon
					icon="material-symbols:skip-previous-rounded"
					class="w-10 h-10 hover:scale-110 duration-100"
				/>
			</button>
			<button on:click={$playingInfo?.is_playing ? togglePause : togglePlay}>
				{#if $playingInfo && $playingInfo?.is_playing}
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
			<button>
				<Icon
					icon="material-symbols:skip-next-rounded"
					class="w-10 h-10 hover:scale-110 duration-100"
				/>
			</button>
		</div>
	{/if}
</div>
