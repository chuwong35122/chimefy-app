<script lang="ts">
	import { devModeStore } from '$stores/navigation/mode';

	export let text = '';
</script>

{#if $devModeStore}
	<p class="text-white text-sm italic">
		[{text}]
	</p>
{/if}
