<script lang="ts">
	import type { SessionMember } from '$lib/interfaces/session/member.interface';
	import Icon from '@iconify/svelte';

	export let member: SessionMember;
</script>

<div class="grid place-items-center relative group">
	<div
		class="w-24 h-24 lg:w-32 lg:h-32 rounded-full absolute top-0 bg-gradient-to-b from-dark-300/40 to-white/30 grid place-items-center hover:from-dark-300/0 hover:to-white/0 duration-300"
	>
		{#if member.is_admin}
			<Icon
				icon="material-symbols:admin-panel-settings-outline-rounded"
				class="w-16 h-16 text-white group-hover:opacity-0 duration-300"
			/>
		{:else}
			<Icon
				icon="icon-park-outline:headphone-sound"
				class="w-16 h-16 text-white group-hover:opacity-0 duration-300"
			/>
		{/if}
	</div>
	<img
		src={member?.profile_img}
		alt={`${member?.display_name} profile`}
		draggable="false"
		class="w-24 h-24 lg:w-32 lg:h-32 rounded-full"
	/>
	<p class="mt-2 text-sm lg:text-md">
		{member?.display_name}
		<!-- {detectSelf(member) ? '(me)' : ''} -->
	</p>
</div>
