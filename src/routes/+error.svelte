<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';

	let previousPage = base || '/';

	function goBack() {
		goto(previousPage);
	}
</script>

<div class="mt-60 w-screen grid place-items-center">
	<div class="grid place-items-center w-full">
		<h1 class="text-[100px] font-bold">{$page?.status}</h1>
		<p class="text-3xl">{$page?.error?.message}</p>
		<div class="mt-4 grid place-items-center">
			<p>Sorry, something just went wrong...</p>
			<button on:click={goBack} class="mt-4">
				<Button color="alternative" pill>Go Back</Button>
			</button>
		</div>
	</div>
</div>
