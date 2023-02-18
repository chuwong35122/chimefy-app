<script lang="ts">
	import '../styles/global.css';
	import NavBar from '../component/UI/NavBar.svelte';

</script>

<div class="w-screen h-screen bg-black">
<NavBar />
	<slot />
</div>
