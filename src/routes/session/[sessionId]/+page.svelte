<script lang="ts">
	import type { MusicSession } from "$lib/interfaces/session.interface";
	import { toastValue } from "$lib/notification/toast";
	import Icon from "@iconify/svelte";
	import { Button, Search, Select, Tooltip } from "flowbite-svelte";
	import type { Record } from "pocketbase";
	import TrackSearchTab from "../../../component/music/TrackSearchTab.svelte";


  export let data: {session: Record & MusicSession}

  function onCopySessionId() {
    toastValue.set({message: "Session's ID copied!", type: 'info'})
    navigator.clipboard.writeText(data.session.id)
  }
</script>

<div class="w-[1000px] h-[600px] p-8 bg-[rgba(255,255,255,0.05)] rounded-xl">
  <Tooltip triggeredBy="[id=copy-id-btn]">Copy Session's ID</Tooltip>
  <div class="flex flex-row justify-between items-center w-full">
    <h1 class="text-3xl font-medium">{data.session.name}</h1>
    <button id='copy-id-btn' on:click={onCopySessionId} class='hover:scale-[1.1] duration-200'>
      <Icon icon='material-symbols:content-copy' width={30} height={30} class='text-gray-500 hover:text-gray-300 duration-200' />
    </button>
  </div>
  <div class="flex flex-row w-full">
    <TrackSearchTab />
  </div>
</div>