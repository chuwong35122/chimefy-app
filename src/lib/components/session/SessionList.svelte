<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase/pb';
	import type { MusicSession } from '$lib/interfaces/session/session.interface';
	import Chip from '../UI/Chip.svelte';
	import Icon from '@iconify/svelte';
	import { Skeleton, Spinner, Tooltip } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import type { Record } from 'pocketbase';

	let sessions: (MusicSession & Record)[] = [];

	async function getSessionList() {
		sessions = [];
		const lists = await pb.collection('sessions').getList<MusicSession & Record>(1, 20, {
			filter: 'isPrivate = false'
		});

		sessions = lists.items;
	}

	function handleSessionNavigate(session: MusicSession & Record) {
		goto(`/session/${session.id}`);
	}

	onMount(async () => {
		await getSessionList();
	});
</script>

<div class="grid place-items-center relative mb-4 w-96">
	<Tooltip triggeredBy="[id=refresh-btn]" placement="right">Refresh this list</Tooltip>
	<h2 class="text-2xl font-semibold">Search for Session</h2>
	<button
		id="refresh-btn"
		class="absolute top-0 right-0 text-dark-400 hover:text-dark-300 duration-200"
	>
		<Icon icon="material-symbols:refresh-rounded" class="w-8 h-8" />
	</button>
</div>
<div class="h-[400px] overflow-y-auto">
{#if sessions.length > 0}
	<!-- Session Item -->
	{#each sessions as session}
		<div
			on:mouseup={() => handleSessionNavigate(session)}
			class="w-[300px] lg:w-[600px] h-28 p-4 rounded-xl bg-dark-500 hover:bg-dark-400/20 duration-150 my-2 relative hover:cursor-pointer"
		>
			<div class="flex items-center">
				<p class="mr-2">{session?.name}</p>
				<Chip label={session?.type} />
			</div>
			{#if session?.queues && session?.queues[0]}
				<div class="mt-6">
					<p class="font-light text-xs text-dark-200">Now Listening</p>
					<p class="font-light text-xs w-80 text-ellipsis">
						{session?.queues[0]?.trackName} - {session?.queues[0]?.artist}
					</p>
				</div>
			{/if}

			<div class="absolute bottom-2 right-0 z-10">
				<div class="flex h-10">
					<!-- Participant List -->
					{#each session.participants as participant, i}
						<img
							src={participant?.profileImg}
							draggable="false"
							alt={`Participant photo ${i + 1}`}
							class={`w-8 h-8 rounded-full ${i > 0 ? 'ml-[-20px] z-[i+1]' : 'ml-0 z-0'}`}
						/>
					{/each}
				</div>
				<Icon icon="material-symbols:chevron-right-rounded" class="w-12 h-12 text-dark-400" />
			</div>
		</div>
	{/each}
	<!-- Session Item -->
{:else}
	<div class="w-full mt-20 grid place-items-center">
		<Spinner color="green" />
	</div>
{/if}
</div>
