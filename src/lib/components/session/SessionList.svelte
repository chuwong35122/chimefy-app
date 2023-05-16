<script lang="ts">
	import type { MusicSession } from '$lib/interfaces/session/session.interface';
	import Chip from '../UI/Chip.svelte';
	import Icon from '@iconify/svelte';
	import { Spinner } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import type { Record } from 'pocketbase';
	import SessionSearchFilter from './SessionSearchFilter.svelte';
	import { sessionSearchResult } from '$lib/session/search';

	function handleSessionNavigate(session: MusicSession) {
		goto(`/session/${session?.uuid}`);
	}
</script>

<div class="grid place-items-center mb-4">
	<h2 class="text-2xl font-semibold">Public Session</h2>
</div>

<SessionSearchFilter />

<div class="h-[400px] md:w-[600px] lg:w-[800px] overflow-y-auto">
	{#if $sessionSearchResult.loading}
		<div class="w-full grid place-items-center">
			<Spinner color="green" />
		</div>
	{:else if $sessionSearchResult.results.length > 0}
		<!-- Session Item -->
		{#each $sessionSearchResult.results as session}
			<div
				on:mouseup={() => handleSessionNavigate(session)}
				class="min-h-28 w-[400px] md:w-[600px] lg:w-[800px] p-4 rounded-xl bg-dark-500 hover:bg-dark-300/20 duration-150 my-2 relative hover:cursor-pointer"
			>
				<div class="flex items-center">
					<p class="mr-2 capitalize text-lg font-medium">{session?.name}</p>
					<Chip label={session?.type} />
				</div>
				<div class="flex items-end mt-2">
					{#if session?.queues && session?.queues[0]}
						<div class="w-20 h-20">
							<img
								src={session?.queues[0]?.trackImageUrl}
								alt="Playing track cover"
								class="w-20 h-20 rounded-full mr-4"
							/>
						</div>
					{:else}
						<p class="text-xs text-gray-400">Waiting...</p>
					{/if}
					{#if session?.queues && session?.queues.length > 0 && session?.queues[0]}
						<div class="flex flex-col h-full w-36 md:w-56 lg:w-80">
							{#if session?.status === 'broadcasting'}
								<p class="text-xs uppercase mb-1">Now Playing</p>
							{:else}
								<p class="text-xs uppercase mb-1">Waiting to play</p>
							{/if}
							<div>
								<p class="font-light text-xs text-ellipsis">
									{session?.queues[0]?.trackName}
								</p>
							</div>
						</div>
					{/if}
				</div>

				<div />
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
					<Icon icon="material-symbols:chevron-right-rounded" class="w-8 h-8 text-dark-300" />
				</div>
			</div>
		{/each}
		<!-- Session Item -->
	{:else}
		<div class="w-full rounded-xl p-4 bg-dark-500 grid place-items-center">
			<p class="text-xl text-medium">Sorry! No session found!</p>
			<Icon icon="ri:emotion-sad-line" class="w-16 h-16 my-2" />
			<p class="text-sm text-dark-200">Tips: Try searching for other things!</p>
		</div>
	{/if}
</div>
