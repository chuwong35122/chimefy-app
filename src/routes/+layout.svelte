<script lang="ts">
	import '../styles/global.css';
	import NavBar from '../component/UI/NavBar.svelte';

</script>

<div class="w-screen h-screen bg-dark-900">
<NavBar />
	<div class="w-full grid place-items-center pt-12">
    <slot />
  </div>
</div>
