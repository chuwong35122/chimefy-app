<script lang="ts">
  import { checkSessionRole, currentSessionRole, adminSessionInitProcess, memberSessionInitProcess } from "$lib/session/session";
	import { ADMIN_SESSION_INTIALIZE_PROCESS, MEMBER_SESSION_INTIALIZE_PROCESS } from "$lib/constants/session";
	import { Spinner } from "flowbite-svelte";
</script>

<div class='p-4'>
  <h1 class='text-xl font-semibold text-white'>Please Wait...</h1>
  <div class="flex flex-row items-center mt-4 gap-2">
    <Spinner color="green" class='mr-4' />
    {#if $currentSessionRole === 'admin' && $adminSessionInitProcess && $adminSessionInitProcess?.length > 0}
    <p class='text-white'>{ADMIN_SESSION_INTIALIZE_PROCESS[$adminSessionInitProcess[0]]?.description}</p>
    <!-- <p class='text-white'>({$adminSessionInitProcess}/{ADMIN_SESSION_INTIALIZE_PROCESS.length-1})</p> -->
    {:else if $currentSessionRole === 'member'}
    <!-- <p class='text-white'>{MEMBER_SESSION_INTIALIZE_PROCESS[$memberSessionInitProcess]?.description}</p> -->
    <!-- <p class='text-white'>({$memberSessionInitProcess}/{MEMBER_SESSION_INTIALIZE_PROCESS.length-1})</p> -->
    {/if}
  </div>
</div>