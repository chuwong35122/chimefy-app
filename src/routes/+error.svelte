<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { Button } from 'flowbite-svelte';

	let previousPage = base || '/';
</script>

<div class="mt-60 w-screen grid place-items-center">
	<div class="grid place-items-center w-full">
		<h1 class="text-8xl font-bold text-primary-600">{$page?.status}</h1>
		<p class="text-xl text-primary">{$page?.error?.message ?? 'Sorry, there is an error'}</p>
		<div class="mt-4 grid place-items-center">
			<a href={previousPage}>
				<Button color="dark" pill>Go Back</Button>
			</a>
		</div>
	</div>
</div>
