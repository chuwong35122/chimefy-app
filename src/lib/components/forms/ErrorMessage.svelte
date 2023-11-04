<script lang="ts">
	import Icon from '@iconify/svelte';

	export let message: string | null | undefined = '';
</script>

{#if message}
	<div class="flex flex-row items-center leading-none mt-0.5">
		<Icon icon="clarity:error-line" class="w-5 h-5 text-pink-500 mr-2" />
		<span class="text-xs text-pink-500">{message}</span>
	</div>
{/if}
