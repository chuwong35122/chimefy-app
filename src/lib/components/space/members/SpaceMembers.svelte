<script lang="ts">
	import SpaceMemberAvatar from './SessionMemberAvatar.svelte'
	import { spaceMemberStore } from '$stores/space';
</script>

<div class="w-full p-4 rounded-xl grid grid-cols-3 place-items-start gap-2">
	{#if $spaceMemberStore && $spaceMemberStore?.length > 0}
		{#each $spaceMemberStore as member}
			<SpaceMemberAvatar {member} />
		{/each}
	{/if}
</div>
