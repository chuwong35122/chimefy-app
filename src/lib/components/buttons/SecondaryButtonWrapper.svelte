<script lang="ts">
	import { Spinner } from 'flowbite-svelte';

	let props = {
		class: [$$restProps.class]
	};

	export let isLoading = false;
</script>

<div
	{...props}
	class={`w-full text-[16px] border border-white py-1.5 rounded-full hover:scale-105 bg-dark-500 px-2 hover:bg-[rgba(255,255,255,0.2)] duration-200 ${props.class}`}
>
	{#if isLoading}
		<div class="py-0.5">
			<Spinner size="6" color="white" />
		</div>
	{:else}
		<slot />
	{/if}
</div>
