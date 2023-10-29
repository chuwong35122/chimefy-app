<script lang="ts">
	import type { SearchType } from '$lib/types/spotify/track.interface';
	import { Search, Spinner, TabItem, Tabs } from 'flowbite-svelte';
	import MusicSearchResult from './MusicSearchResult.svelte';
	import type { Track, SimplifiedPlaylist } from 'spotify-types';
	import { searchPlaylist, searchTrack } from '$utils/session/track';
	import { spotifyAccessToken } from '$stores/spotify/user';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { toastValue } from '$stores/notification/toast';
	import PlaylistSearchResult from './tracks/PlaylistSearchResult.svelte';

	export let supabase: SupabaseClient;

	let timer: NodeJS.Timer;
	let searchTerms = '';
	let debouncedSearchTerms = '';
	let type: SearchType = 'track';

	let trackSearchResults: Track[] = [];
	let playlistSearchResults: SimplifiedPlaylist[] = [];

	let loading = false;

	$: if (searchTerms && type) debounce();

	async function debounce() {
		loading = true;

		if (!$spotifyAccessToken) {
			loading = false;
			trackSearchResults = [];
			playlistSearchResults = [];
		}

		clearTimeout(timer);

		timer = setTimeout(async () => {
			debouncedSearchTerms = searchTerms;

			if (!debouncedSearchTerms) {
				if (type === 'playlist') {
					playlistSearchResults = [];
				} else if (type === 'track') {
					trackSearchResults = [];
				}
				loading = false;
				return;
			}

			try {
				if (type === 'track') {
					const tracks = await searchTrack(debouncedSearchTerms, $spotifyAccessToken?.access_token);
					trackSearchResults = tracks;
				} else if (type === 'playlist') {
					const playlists = await searchPlaylist(
						debouncedSearchTerms,
						$spotifyAccessToken?.access_token
					);
					playlistSearchResults = playlists;
				}
			} catch (e) {
				trackSearchResults = [];
				playlistSearchResults = [];
				toastValue.set({ message: 'Search error', type: 'error' });
			} finally {
				loading = false;
			}
		}, 750);
	}

	// $: if (loading && !debouncedSearchTerms) {
	// 	setTimeout(() => {
	// 		loading = false
	// 	}, 1000);
	// }
</script>

<div class="w-full grid place-items-center">
	<form class="w-full">
		<div class="w-full space-y-2">
			<Search bind:value={searchTerms} size="md" class="!blur:border-gray-200 !border-gray-200" />
		</div>
		<Tabs style="underline" contentClass="bg-transparent">
			<TabItem open title="Tracks" on:click={() => (type = 'track')}>
				<div class="w-full h-[420px] overflow-y-auto overflow-x-hidden">
					{#if loading}
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
			<TabItem title="Playlists" on:click={() => (type = 'playlist')}>
				<div class="w-full h-[420px] overflow-y-auto overflow-x-hidden">
					{#if loading}
						<div class="w-full h-full grid place-items-center">
							<Spinner size="10" color="green" />
						</div>
					{:else if playlistSearchResults.length > 0}
						{#each playlistSearchResults as playlist}
							<PlaylistSearchResult {playlist} {supabase} />
						{/each}
					{/if}
				</div>
			</TabItem>
		</Tabs>
	</form>
</div>
