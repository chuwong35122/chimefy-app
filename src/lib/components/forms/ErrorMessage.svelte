<script lang="ts">
	import Icon from '@iconify/svelte';

	export let message: string | null | undefined = '';
</script>

{#if message}
	<div class="flex flex-row items-center text-sp leading-none">
		<Icon icon="material-symbols:error-rounded" class="w-5 h-5 text-red-500 mr-2" />
		<span class="text-sm font-light text-red-500">{message}</span>
	</div>
{/if}
