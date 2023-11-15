<script lang="ts">
	import { spaceMemberStore } from '$stores/space';
</script>

<div class="flex flex-row items-center gap-2 w-28">
  <div class="flex flex-row-reverse items-center relative w-full">
    {#each $spaceMemberStore as member, i}
      {#if i < 5}
        <img
          src={member.profile_img}
          alt={member.display_name}
          width="32"
          height="32"
          draggable="false"
          class={`w-8 h-8 rounded-full -ml-5 z-[${i + 1}]`}
        />
      {/if}
    {/each}
  </div>
  {#if $spaceMemberStore.length > 6}
    <div class="text-xs text-dark-300">
      +{$spaceMemberStore.length - 6}
    </div>
  {/if}  
</div>