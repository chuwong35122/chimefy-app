<script lang="ts">
	import Icon from '@iconify/svelte';

	export let step = '';
	export let description = '';
	export let icon = '';
	export let hasNext = true;
</script>

<div class="p-2 w-48 my-2 rounded-lg relative bg-black/20">
	<p>{step}</p>
	<div class="w-full h-full grid place-items-center">
		<Icon {icon} class="w-12 h-12 mb-2" />
		<p class="text-lg">{description}</p>
	</div>

	{#if hasNext}
		<Icon
			icon="icon-park-solid:right-c"
			class="hidden lg:block w-12 h-12 text-black/40 absolute right-[-20px] top-[30%]"
		/>
	{/if}
</div>
