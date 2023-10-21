<script lang="ts">
	import type { SessionMember } from '$lib/types/session/member.interface';
	import { currentSession, currentSessionMember } from '$stores/session';
	import { userStore } from '$stores/auth/user';
	import { onDestroy, onMount } from 'svelte';
	import SessionMemberAvatar from './SessionMemberAvatar.svelte';
	import { devModeStore } from '$stores/settings';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let supabase: SupabaseClient
	export let id: number

	let participants: SessionMember[] = [];
	let self: SessionMember;

	const channel = supabase.channel(`space_member_listener_${id}`, {
		config: {
			presence: {
				key: 'members'
			}
		}
	});

	userStore.subscribe((user) => {
		self = {
			joined_since: new Date(),
			display_name: user?.user_metadata?.name ?? 'Anonymous',
			member_user_id: user?.id ?? '',
			is_admin: $currentSession?.created_by === user?.id,
			profile_img: user?.user_metadata?.avatar_url
		};
	});

	// currentSessionMember.subscribe((members) => {
	// 	if (self?.member_user_id) {
	// 		participants = members.filter((member) => member.member_user_id !== self.member_user_id);
	// 	}
	// });

	onMount(async () => {
		channel.on('presence', { event: 'sync' }, () => {
			const { members } = channel.presenceState();
			if (members && members.length > 0) {
				console.log("sync", members)
				// currentSessionMember.set(members as any as SessionMember[]);
			}
		});

		channel.on('presence', { event: 'join' }, ({ newPresences }) => {
			const newComers = newPresences as any as SessionMember[];
			console.log("join", newComers)
			// currentSessionMember.update((member) => [...member, ...newComers]);
		});

		channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
			leftPresences.forEach((left) => {
				const leftId = left as any as SessionMember;
				console.log("leave", leftId)
				// currentSessionMember.update((member) =>
				// 	member.filter((member) => member.member_user_id !== leftId.member_user_id)
				// );
			});
		});

		channel.subscribe(async (status) => {
			if ($devModeStore) {
				console.log('Member channel status', status);
			}

			if (status === 'SUBSCRIBED') {
				await channel.track({ ...self });
			}
		});
	});

	onDestroy(async () => {
		await channel.unsubscribe();
		if ($devModeStore) {
			console.log('Member channel destroyed');
		}
	});
</script>

<div class="mt-20">
	<h2 class="text-3xl font-bold">Space Members</h2>
	<div
		class="w-full p-4 rounded-xl grid grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4 max-h-96 overflow-y-auto"
	>
		{#if self}
			<SessionMemberAvatar member={self} />
		{/if}
		{#each participants as member}
			<SessionMemberAvatar {member} />
		{/each}
	</div>
	<div class="h-12" />
</div>
