<script lang="ts">
  export let handleClick: (() => void )| undefined = undefined;
  export let label: string = ''
  export let type: 'input' | 'button' = 'button'

  let baseClass = `w-full bg-primary-600 hover:bg-primary-500 duration-200 p-2 rounded-full mt-4 text-lg uppercase`
</script>

{#if type === 'button'}
<button
on:click|preventDefault={handleClick}
	class={baseClass}
	>{label}</button
>
{:else if type === 'input'}
<input
type='submit'
	class={baseClass}
  value={label} />
{/if}