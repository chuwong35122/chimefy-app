<script lang="ts">
	import type { SessionMember } from '$lib/interfaces/session/member.interface';
	import { currentSession, currentSessionMember, currentSessionRole } from '$lib/session/session';
	import { userStore } from '$lib/supabase/user';
	import { onDestroy, onMount } from 'svelte';
	import SessionMemberAvatar from './SessionMemberAvatar.svelte';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import { supabase } from '$lib/supabase/supabase';

	let channel: RealtimeChannel;

	let participants: SessionMember[] = [];
	let self: SessionMember;

	userStore.subscribe((user) => {
		self = {
			joined_since: new Date(),
			display_name: user?.user_metadata?.name ?? 'Anonymous',
			member_user_id: user?.id ?? '',
			is_admin: $currentSessionRole === 'admin',
			profile_img: user?.user_metadata?.avatar_url
		};
	});

	currentSessionMember.subscribe((members) => {
		if (self?.member_user_id) {
			participants = members.filter((member) => member.member_user_id !== self.member_user_id);
		}
	});

	onMount(async () => {
		channel = supabase.channel(`session_member_listener_${$currentSession?.id}`, {
			config: {
				presence: {
					key: 'members'
				}
			}
		});

		channel.on('presence', { event: 'sync' }, () => {
			const { members } = channel.presenceState();
			if (members && members.length > 0) {
				currentSessionMember.set(members as any as SessionMember[]);
			}
		});
		channel.on('presence', { event: 'join' }, ({ newPresences }) => {
			const newComers = newPresences as any as SessionMember[];
			currentSessionMember.update((member) => [...member, ...newComers]);
		});
		channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
			leftPresences.forEach((left) => {
				const leftId = left as any as SessionMember;
				currentSessionMember.update((member) =>
					member.filter((member) => member.member_user_id !== leftId.member_user_id)
				);
			});
		});

		channel.subscribe(async (status) => {
			console.log(status);
			if (status === 'SUBSCRIBED') {
				await channel.track({ ...self });
			}
		});
	});

	onDestroy(async () => {
		await channel.unsubscribe();
	});
</script>

<!-- TODO: Show self at the front -->
<!-- Show others, Max: 35 other members -->
<div class="mt-20">
	<h2 class="text-3xl font-bold">Session Members</h2>
	<div class="w-full p-4 rounded-xl grid grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4">
		{#if self}
			<SessionMemberAvatar member={self} />
		{/if}
		{#each participants as member}
			<SessionMemberAvatar {member} />
		{/each}
	</div>
	<div class="h-12" />
</div>
