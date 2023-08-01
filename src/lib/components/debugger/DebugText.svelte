<script lang="ts">
	import { devModeStore } from '$stores/settings';

	export let text = '';
</script>

{#if $devModeStore}
	<p class="text-white text-sm italic">
		[{text}]
	</p>
{/if}
