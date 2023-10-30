<script lang="ts">
	import type { SpaceMember } from '$lib/types/session/member.interface';
		import { Badge } from 'flowbite-svelte';

	export let member: SpaceMember;
</script>

<div class="h-24">
	<img
		src={member?.profile_img}
		alt={`${member?.display_name} profile`}
		draggable="false"
		class="w-16 h-16 rounded-full mb-2"
	/>
	{#if member.is_admin}
		<Badge color="green">Admin</Badge>
	{/if}
</div>
