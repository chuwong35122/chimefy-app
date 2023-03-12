<script lang="ts">
	import type { MusicSession } from "$lib/interfaces/session.interface";
	import { toastValue } from "$lib/notification/toast";
	import Icon from "@iconify/svelte";
	import { Button, Search, Tooltip } from "flowbite-svelte";
	import type { Record } from "pocketbase";


  export let data: {session: Record & MusicSession}
  let searchTerms = ''

  function onCopySessionId() {
    toastValue.set({message: "Session's ID copied!", type: 'info'})
    navigator.clipboard.writeText(data.session.id)
  }
</script>

<div class="w-[80%] p-4 grid place-items-center bg-[rgba(255,255,255,0.05)] rounded-xl">
  <Tooltip triggeredBy="[id=copy-id-btn]">Copy Session's ID</Tooltip>
  <div class="flex flex-row justify-between items-center w-full">
    <h1 class="text-3xl font-medium">{data.session.name}</h1>
    <button id='copy-id-btn' on:click={onCopySessionId} class='hover:scale-[1.1] duration-200'>
      <Icon icon='material-symbols:content-copy' width={30} height={30} class='text-gray-500 hover:text-gray-300 duration-200' />
    </button>
  </div>
  <div class="flex flex-row w-full">
  <div class='mt-6'>
    <form class="flex gap-2 w-96">
      <Search bind:value={searchTerms} size="md" />
      <Button btnClass='bg-primary-500 p-2 rounded-lg hover:scale-[1.1] duration-200'>
        <Icon icon='material-symbols:search' width={22} height={22} />
      </Button>
    </form>
  </div>
  </div>
</div>