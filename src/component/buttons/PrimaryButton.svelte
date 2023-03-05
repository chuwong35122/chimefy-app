<script lang="ts">
	import { Spinner } from 'flowbite-svelte';

	let props = {
		class: [$$restProps.class]
	};

	export let isLoading = false;
</script>

<button
	on:click
	{...props}
	class={`bg-primary-500 font-semibold text-black p-2 w-full hover:bg-primary-400 duration-200 rounded-full hover:scale-[1.03] ${props.class}`}
>
	{#if isLoading}
		<Spinner class="mr-3" size="4" color="white" />
	{:else}
		<slot />
	{/if}
</button>
