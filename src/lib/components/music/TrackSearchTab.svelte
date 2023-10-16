<script lang="ts">
	import type { SearchType } from '$lib/interfaces/spotify/track.interface';
	import { Search, Spinner } from 'flowbite-svelte';
	import MusicSearchResult from './MusicSearchResult.svelte';
	import type { Track } from 'spotify-types';
	import { searchTrack } from '$utils/session/track';
	import { spotifyAccessToken } from '$stores/spotify/user';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let supabase: SupabaseClient

	let timer: NodeJS.Timer;
	let searchTerms = '';
	let debouncedSearchTerms = '';
	let type: SearchType = 'track';

	let trackSearchResults: Track[] = [];

	let loading = false;

	async function debounce() {
		loading = true;
		if (!$spotifyAccessToken) {
			trackSearchResults = [];
			loading = false;
			return;
		}

		clearTimeout(timer);
		timer = setTimeout(async () => {
			debouncedSearchTerms = searchTerms;
			if (!debouncedSearchTerms) {
				trackSearchResults = [];
				return;
			}
			const tracks = await searchTrack(
				debouncedSearchTerms,
				type,
				$spotifyAccessToken?.access_token
			);
			trackSearchResults = tracks;
			loading = false;
		}, 500);
	}

	$: if (loading && !debouncedSearchTerms) {
		setTimeout(() => {
			loading = false;
		}, 1000);
	}
</script>

<div class="mt-6 px-4 w-full grid place-items-center">
	<form class="flex gap-2 w-full">
		<Search
			on:keyup={debounce}
			bind:value={searchTerms}
			size="md"
			class="!rounded-full !blur:border-gray-200 !border-gray-200"
		/>
	</form>
	<div class="w-full h-[400px] lg:h-[560px] overflow-y-auto overflow-x-hidden">
		{#if loading}
			<div class="w-full h-full grid place-items-center">
				<Spinner size="10" color="green" />
			</div>
		{:else if trackSearchResults.length > 0}
			{#each trackSearchResults as track}
				<MusicSearchResult {track} {supabase} />
			{/each}
		{:else}
			<div class="h-[100px]" />
		{/if}
	</div>
</div>
