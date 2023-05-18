<script lang="ts">
	import type { MusicSession } from '$lib/interfaces/session/session.interface';
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

<div
	class="w-[320px] md:w-[600px] lg:w-[800px] overflow-y-auto grid grid-cols-2 md:grid-cols-3 h-[600px]"
>
	{#if $sessionSearchResult.loading}
		<div class="w-full grid place-items-center">
			<Spinner color="green" />
		</div>
	{:else if $sessionSearchResult.results.length > 0}
		<!-- Session Item -->
		{#each $sessionSearchResult.results as session}
			<div
				on:mouseup={() => handleSessionNavigate(session)}
				class="h-64 w-[140px] md:w-[180px] lg:w-[240px] p-4 rounded-xl bg-dark-500 hover:bg-dark-300/20 duration-150 my-2 relative hover:cursor-pointer"
			>
				<div class="w-full grid place-items-center">
					<p>{session.type}</p>
					<div class="w-full border-b-[1px] border-dark-400 my-2" />
				</div>
				<p class="mr-2 capitalize text-lg font-medium">{session?.name}</p>
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
				<div class="absolute bottom-2 flex flex-row justify-between max-w-[70%] overflow-hidden">
					<div>
						<div class="h-10">
							<!-- Participant List -->
							<!-- TODO: Make a faded image as it get near the arrow -->
							{#each session.participants as participant, i}
								<img
									src={participant?.profileImg}
									draggable="false"
									alt={`Participant photo ${i + 1}`}
									class={`w-8 h-8 rounded-full ${i > 0 ? 'ml-[-20px] z-[i+1]' : 'ml-0 z-0'}`}
								/>
							{/each}
						</div>
					</div>
					<Icon icon="material-symbols:chevron-right-rounded" class="w-8 h-8 text-dark-300" />
				</div>
			</div>
		{/each}
		<!-- Session Item -->
	{:else}
	<div />
		<div class="h-[200px] w-full rounded-xl p-4 bg-dark-500 grid place-items-center mt-12">
			<p class="text-xl text-medium">Sorry! No session found!</p>
			<Icon icon="ri:emotion-sad-line" class="w-16 h-16 my-2" />
			<p class="text-sm text-dark-200">Tips: Try searching for other things!</p>
		</div>
	{/if}
</div>
