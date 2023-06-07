<script lang="ts">
	import type { MusicSessionInfo } from '$lib/interfaces/session/session.interface';
	import Icon from '@iconify/svelte';
	import { Popover, Spinner } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import SessionSearchFilter from './SessionSearchFilter.svelte';
	import { sessionSearchResult } from '$lib/session/search';

	function handleSessionNavigate(session: MusicSessionInfo) {
		goto(`/session/${session?.uuid}`);
	}
</script>

<div class="w-[400px] md:w-[500px] lg:w-[600px]">
	<div class="grid place-items-center mb-4">
		<h2 class="text-2xl font-semibold">Public Session</h2>
	</div>

	<SessionSearchFilter />

	<div class="overflow-y-auto flex flex-col h-[600px]">
		{#if $sessionSearchResult.loading}
			<div class="w-full grid place-items-center">
				<Spinner color="green" />
			</div>
		{:else if $sessionSearchResult.results.length > 0}
			<!-- Session Item -->

			{#each $sessionSearchResult.results as session, i}
				<div class="flex items-center">
					{#if session?.session_queue[0]?.queues?.length > 0}
						<Popover title="Now Playing..." triggeredBy={`#track-img-${i}`}>
							<p class="font-semibold text-sm">
								{session?.session_queue[0]?.queues[0]?.track_name}
							</p>
							<p class="text-xs">{session?.session_queue[0]?.queues[0]?.artist}</p>
						</Popover>
					{:else}
						<Popover title="Waiting..." triggeredBy="#waiting-popover">
							<p class="text-sm">Waiting for a queue to be added...</p>
						</Popover>
					{/if}

					<p>{i + 1}</p>

					<div
						on:mouseup={() => handleSessionNavigate(session)}
						class="h-20 flex flex-row items-center ml-4 w-full p-2 pl-4 rounded-xl hover:bg-dark-300/20 duration-150 my-2 relative hover:cursor-pointer overflow-hidden"
					>
						{#if session?.session_queue && session?.session_queue[0] && session?.session_queue[0]?.queues && session?.session_queue[0]?.queues[0]?.track_image_url}
							<img
								id={`track-img-${i}`}
								src={session?.session_queue[0].queues[0]?.track_image_url}
								alt="Playing track cover"
								class="w-16 h-16 mr-4 rounded-md"
							/>
						{:else}
							<div
								id="waiting-popover"
								class="w-16 h-16 grid place-items-center bg-white/10 rounded-md"
							>
								<Icon icon="material-symbols:hourglass-empty-rounded" class="w-8 h-8" />
							</div>
						{/if}

						<div class="leading-4 ml-4">
							<p class="mr-2 capitalize font-medium ">{session?.name}</p>
							<p class="text-xs text-dark-100">{session.type}</p>
						</div>
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
			<div />
		{/if}
	</div>
</div>
