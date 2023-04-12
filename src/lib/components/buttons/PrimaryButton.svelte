<script lang="ts">
	import { Spinner } from 'flowbite-svelte';

	let props = {
		class: [$$restProps.class]
	};

	export let isLoading = false;
</script>

<div
	{...props}
	class={`bg-primary-600 font-regular text-white p-2 w-full hover:bg-primary-500 duration-200 rounded-full hover:scale-[1.03] grid place-items-center hover:cursor-pointer font-medium ${props.class}`}
>
	{#if isLoading}
		<Spinner class="mr-3" size="4" color="white" />
	{:else}
		<slot />
	{/if}
</div>
