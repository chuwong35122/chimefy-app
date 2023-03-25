<script lang="ts">
	import type { SearchType } from '$lib/interfaces/spotify/track.interface';
	import { Search } from 'flowbite-svelte';
	import MusicSearchResult from './MusicSearchResult.svelte';
	import type { Track } from 'spotify-types';
	import { searchTrack } from '$lib/session/track';
	import { spotifyAccessToken, spotifyUser } from '$lib/spotify/spotify';

	let timer: NodeJS.Timer;
	let searchTerms = '';
	let debouncedSearchTerms = '';
	let type: SearchType = 'track';

	// let searchTypes = [
	// 	{ value: 'album', name: 'Album' },
	// 	{ value: 'track', name: 'Track' }
	// ];

	let trackSearchResults: Track[] = [];

	async function debounce() {
		if (!$spotifyAccessToken) {
			trackSearchResults = [];
			return;
		}

		clearTimeout(timer);
		timer = setTimeout(async () => {
			debouncedSearchTerms = searchTerms;
			if (!debouncedSearchTerms) {
				trackSearchResults = [];
				return;
			}
			const tracks = await searchTrack(debouncedSearchTerms, type, $spotifyAccessToken);
			trackSearchResults = tracks;
		}, 500);
	}
</script>

<div class="mt-6 px-4 w-full grid place-items-center">
	<form class="flex gap-2 w-full lg:w-80">
		<Search
			on:keyup={debounce}
			bind:value={searchTerms}
			size="md"
			class="!rounded-full !blur:border-gray-200 !border-gray-200"
		/>
	</form>
	<div class="w-full h-[400px] lg:h-[560px] overflow-y-auto overflow-x-hidden">
		{#if trackSearchResults.length > 0}
			{#each trackSearchResults as track}
				<MusicSearchResult {track} />
			{/each}
		{:else}
		<div class='h-[100px]'/>
		{/if}
	</div>
</div>