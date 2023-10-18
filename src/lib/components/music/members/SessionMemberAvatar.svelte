<script lang="ts">
	import type { SessionMember } from '$interfaces/session/member.interface';
	import Icon from '@iconify/svelte';
	import DebugText from '$components/debugger/DebugText.svelte';

	export let member: SessionMember;
</script>

<div class="grid place-items-center relative group">
	<div
		class="w-24 h-24 rounded-full absolute top-0 bg-dark-40 grid place-items-center hover:from-dark-300/0 hover:to-white/0 duration-300"
	>
		{#if member.is_admin}
			<Icon
				icon="material-symbols:admin-panel-settings-outline-rounded"
				class="w-12 h-12 text-white group-hover:opacity-0 duration-300"
			/>
		{:else}
			<Icon
				icon="icon-park-outline:headphone-sound"
				class="w-12 h-12 text-white group-hover:opacity-0 duration-300"
			/>
		{/if}
	</div>
	<img
		src={member?.profile_img}
		alt={`${member?.display_name} profile`}
		draggable="false"
		class="w-24 h-24 rounded-full"
	/>
	<p class="mt-2 font-medium text-sm lg:text-md">
		{member?.display_name}
	</p>
	<DebugText text={member.is_admin ? 'admin' : 'member'} />
</div>
