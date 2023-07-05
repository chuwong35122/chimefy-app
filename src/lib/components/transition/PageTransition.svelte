<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	export let url = '';
	const pageTransitionDuration = 250;
</script>

{#key url}
	<div
		in:fade={{ duration: pageTransitionDuration, delay: pageTransitionDuration }}
		out:fly={{ x: 5, duration: pageTransitionDuration }}
		class="w-full grid place-items-center"
	>
		<slot />
	</div>
{/key}
