<script lang="ts">
	import type { MusicSession } from '$lib/interfaces/session/session.interface';
	import Chip from '../UI/Chip.svelte';
	import Icon from '@iconify/svelte';
	import { Spinner } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import type { Record } from 'pocketbase';
	import SessionSearchFilter from './SessionSearchFilter.svelte';
	import { sessionSearchResult } from '$lib/session/search';

	function handleSessionNavigate(session: MusicSession & Record) {
		goto(`/session/${session.id}`);
	}
</script>

<div class="grid place-items-center mb-4 w-96">
	<h2 class="text-2xl font-semibold">Search for Session</h2>
</div>

<SessionSearchFilter />

<div class="h-[400px] overflow-y-auto">
	{#if $sessionSearchResult.loading}
	<div class="w-full grid place-items-center">
		<Spinner color='green' />
	</div>
	{:else}
	{#if $sessionSearchResult.results.length > 0}
	<!-- Session Item -->
	{#each $sessionSearchResult.results as session}
		<div
			on:mouseup={() => handleSessionNavigate(session)}
			class="w-[300px] md:w-[600px] min-h-28 p-4 rounded-xl bg-dark-500 hover:bg-dark-400/20 duration-150 my-2 relative hover:cursor-pointer"
		>
			<div class="flex items-center">
				<p class="mr-2">{session?.name}</p>
				<Chip label={session?.type} />
			</div>
			{#if session?.queues && session?.queues[0]}
				<div class="mt-1">
					<p class="font-light text-[10px] text-dark-200">Now Listening</p>
					<p class="font-normal text-[12px] w-52 md:w-[400px] lg:w-80 text-ellipsis">
						{session?.queues[0]?.trackName}
					</p>
					<p class="font-light text-[8px] w-40 lg:w-80 text-ellipsis text-dark-200">
						{session?.queues[0]?.artist}
					</p>
				</div>
			{/if}

			<div class="absolute bottom-2 right-0 z-10 w-16">
				<div class="flex h-10 overflow-hidden">
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
		<div class="w-full rounded-xl p-4 bg-dark-500 grid place-items-center">
			<p class="text-xl text-medium">Sorry! No session found!</p>
			<Icon icon='ri:emotion-sad-line' class='w-16 h-16 my-2' />
			<p class='text-sm text-dark-200'>Tips: Try searching for other things!</p>
		</div>
{/if}
	{/if}
</div>
