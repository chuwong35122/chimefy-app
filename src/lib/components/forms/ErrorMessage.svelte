<script lang="ts">
	import Icon from '@iconify/svelte';

	export let message: string | null | undefined = '';
	export let showBorder = true;
</script>

{#if message}
	<div
		class={`flex flex-row items-center bg-white rounded-full ${
			showBorder ? 'ring-2 ring-red-600 p-2' : ''
		}`}
	>
		<Icon icon="material-symbols:error-rounded" class="w-6 h-6 text-red-600 mr-2" />
		<span class="text-sm font-light text-red-600">{message}</span>
	</div>
{/if}
