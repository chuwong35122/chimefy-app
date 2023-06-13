<script lang="ts">
  export let debuggerTitle = 'Debugger'
</script>

<div class='bg-blue-900/40 hover:bg-blue-900/60 duration-150 grid place-items-center p-4 m-2 rounded-xl w-full'>
  <p class='text-lg font-medium underline'>{debuggerTitle}</p>
  <div class="text-sm">
    <slot />
  </div>
</div>