<script lang="ts">
	import type { SearchType } from '$lib/types/spotify/track.interface';
	import { Search, Spinner, TabItem, Tabs } from 'flowbite-svelte';
	import MusicSearchResult from './MusicSearchResult.svelte';
	import type { Track } from 'spotify-types';
	import { searchTrack } from '$utils/session/track';
	import { spotifyAccessToken } from '$stores/spotify/user';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let supabase: SupabaseClient;

	let timer: NodeJS.Timer;
	let searchTerms = '';
	let debouncedSearchTerms = '';
	let type: SearchType = 'track';

	let trackSearchResults: Track[] = [];
	let playlistSearchResults: any[] = [];

	let trackSearchLoading = false;
	let playlistSearchLoading = false;

	async function debounce() {
		trackSearchLoading = true;
		if (!$spotifyAccessToken) {
			trackSearchResults = [];
			trackSearchLoading = false;
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
			trackSearchLoading = false;
		}, 500);
	}

	$: if (trackSearchLoading && playlistSearchLoading && !debouncedSearchTerms) {
		setTimeout(() => {
			trackSearchLoading = false;
			playlistSearchLoading = false;
		}, 1000);
	}
</script>

<div class="w-full grid place-items-center">
	<form class="w-full">
		<div class="w-full space-y-2">
			<Search
				on:keyup={debounce}
				bind:value={searchTerms}
				size="md"
				class="!blur:border-gray-200 !border-gray-200"
			/>
		</div>
		<Tabs style="underline" contentClass="bg-transparent">
			<TabItem open title="Tracks">
				<div class="w-full h-[420px] overflow-y-auto overflow-x-hidden">
					{#if trackSearchLoading}
						<div class="w-full h-full grid place-items-center">
							<Spinner size="10" color="green" />
						</div>
					{:else if trackSearchResults.length > 0}
						{#each trackSearchResults as track}
							<MusicSearchResult {track} {supabase} />
						{/each}
					{/if}
				</div>
			</TabItem>
			<TabItem title="Playlists">
				{#if playlistSearchLoading}
					<div class="w-full h-full grid place-items-center">
						<Spinner size="10" color="green" />
					</div>
				{:else if playlistSearchResults.length > 0}
					{#each trackSearchResults as track}
						<!-- <MusicSearchResult {track} {supabase} /> -->
					{/each}
				{/if}
			</TabItem>
		</Tabs>
	</form>
</div>
