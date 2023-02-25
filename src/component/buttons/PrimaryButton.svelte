<script lang="ts">
  let props = {
    class:[$$restProps.class]
  }
</script>

<button on:click {...props} class={`bg-primary-500 font-semibold text-black p-2 w-full hover:bg-primary-400 duration-200 rounded-full hover:scale-105 ${props.class}`}>
  <slot />
</button>