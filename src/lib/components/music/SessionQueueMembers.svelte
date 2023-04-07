<script lang="ts">
	import type { MusicSessionMember } from '$lib/interfaces/session/session.interface';
	import { currentSession } from '$lib/session/session';
	import Icon from '@iconify/svelte';

	let participants: MusicSessionMember[] = [];

	currentSession.subscribe((val) => {
		if (val && val.participants) {
			participants = val.participants;
		}
	});
</script>

<div class="mt-20">
	<h2 class="text-3xl font-bold">Session Members</h2>
	<div class="w-full p-4 rounded-xl bg-black grid grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4">
		{#each participants as member}
			<div class="grid place-items-center relative group">
				<div
					class="w-24 h-24 lg:w-32 lg:h-32 rounded-full absolute top-0 bg-gradient-to-b from-dark-300/40 to-white/30 grid place-items-center hover:from-dark-300/0 hover:to-white/0 duration-300"
				>
					{#if member.role === 'admin'}
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
					src={member?.profileImg}
					alt={`${member?.spotifyDisplayedName} profile`}
					draggable="false"
					class="w-24 h-24 lg:w-32 lg:h-32 rounded-full"
				/>
				<p class="mt-2 text-sm lg:text-md">{member?.spotifyDisplayedName}</p>
			</div>
		{/each}
	</div>
	<div class="h-12" />
</div>
