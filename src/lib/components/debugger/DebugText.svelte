<script lang="ts">
	import { PUBLIC_NODE_ENV } from '$env/static/public';

	export let text = '';
</script>

{#if PUBLIC_NODE_ENV === 'development'}
	<p class="text-white text-sm italic">
		[{text}]
	</p>
{/if}
