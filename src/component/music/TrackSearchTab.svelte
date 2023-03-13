<script lang="ts">
	import type { SearchType } from "$lib/interfaces/spotify/track.interface";
	import { Search } from "flowbite-svelte";
	import MusicSearchResult from "./MusicSearchResult.svelte";
  let timer: NodeJS.Timer;
  let searchTerms = ''
  let debouncedSearchTerms = '';
  let type: SearchType = 'track'

  let searchTypes = [
    {value:"album", name: "Album"},
    {value:"track", name: "Track"},
  ]

  

  function debounce() {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedSearchTerms = searchTerms;
    }, 500)
  }


</script>

<div class='mt-6'>
  <div>{debouncedSearchTerms}</div>
  <form class="flex gap-2 w-80">
    <Search on:keyup={debounce} bind:value={searchTerms} size="md" class='!rounded-full !blur:border-gray-200 !border-gray-200' />
  </form>
  <div>
    <MusicSearchResult />
    <MusicSearchResult />
    <MusicSearchResult />
  </div>
</div>