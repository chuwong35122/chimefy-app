<script lang="ts">
	import type { SessionMember } from '$lib/interfaces/session/member.interface';
	import { currentSessionRole } from '$lib/session/session';
	import { userStore } from '$lib/supabase/user';
	import { onMount } from 'svelte';
	import SessionMemberAvatar from './SessionMemberAvatar.svelte';
	import { ioClient } from '$lib/socket/client';

	const socketConnection = ioClient.connect();
	let participants: SessionMember[] = [];

	let self: SessionMember;
	userStore.subscribe((user) => {
		self = {
			joined_since: new Date(),
			display_name: user?.user_metadata?.name ?? 'Anynymous',
			member_user_id: user?.id ?? '',
			is_admin: $currentSessionRole === 'admin',
			profile_img: user?.user_metadata?.avatar_url
		};
	});

	onMount(() => {
		socketConnection.emit('request_members');

		socketConnection.on('newcomer_joined', () => {
			
		})

		socketConnection.on('member_response', (members: SessionMember[]) => {
			const filteredMembers = members.filter(
				(_members) => _members.member_user_id !== self.member_user_id
			);
			participants = filteredMembers;
		});
	});
</script>

<!-- TODO: Show self at the front -->
<!-- Show others, Max: 35 other members -->
<div class="mt-20">
	<h2 class="text-3xl font-bold">Session Members</h2>
	<div class="w-full p-4 rounded-xl bg-black grid grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4">
		{#if self}
			<SessionMemberAvatar member={self} />
		{/if}
		{#each participants as member}
			<SessionMemberAvatar {member} />
		{/each}
	</div>
	<div class="h-12" />
</div>
