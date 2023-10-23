<script lang="ts">
	import SessionMemberAvatar from './SessionMemberAvatar.svelte';
	import { spaceMemberStore } from '$stores/space';
</script>

<div class="w-full p-4 rounded-xl grid grid-cols-3 place-items-start gap-2">
	{#if $spaceMemberStore && $spaceMemberStore?.length > 0}
		{#each $spaceMemberStore as member}
			<SessionMemberAvatar {member} />
		{/each}
	{/if}
</div>
