<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Spinner } from 'flowbite-svelte';
	import SessionSearchFilter from './SessionSearchFilter.svelte';
	import { sessionSearchResult } from '$lib/session/search';
	import SessionItem from './SessionItem.svelte';
</script>

<div class="w-full pt-4">
	<SessionSearchFilter />

	<div class="overflow-y-auto flex flex-col h-[600px]">
		{#if $sessionSearchResult.loading}
			<div class="w-full grid place-items-center">
				<Spinner color="green" />
			</div>
		{:else if $sessionSearchResult.results.length > 0}
			<!-- Session Item -->

			{#each $sessionSearchResult.results as session, i}
				<SessionItem {session} index={i} />
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
