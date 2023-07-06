<script lang="ts">
	import FaqSection from '$lib/components/landing/FAQSection.svelte';
	import HowToSteps from '$lib/components/landing/HowToSteps.svelte';
</script>

<svelte:head>
	<meta charset="UTF-8">
  <meta name="description" content="Listen to Spotify music together with friends">
  <meta name="keywords" content="chimefy, spotify, listen together, sync spotify">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Welcome to Chimefy</title>
</svelte:head>

<div class="w-full">
	<section class="h-[80vh]">
		<div class="grid place-content-center h-[600px] relative overflow-hidden">
			<div class="flex flex-col items-center w-full h-full z-50 relative">
				<h1 class="text-4xl md:text-6xl lg:text-7xl font-extrabold ml-2">
					Welcome to <span class="text-primary">Chimefy 
				</h1>
				<h2 class="ml-4 text-lg md:text-xl mt-4">
					A place where you can sync <a
						target="_blank"
						rel="noreferrer"
						href="https://www.spotify.com/"
						class="text-primary underline underline-offset-1">Spotify music</a
					> with your friends!
				</h2>
			</div>
		</div>
	</section>
	<section class="w-full">
		<div class="grid place-items-center">
			<h3 class="text-3xl font-bold text-white">How to use?</h3>
		</div>
		<HowToSteps />
	</section>
</div>
<section class="p-8">
	<FaqSection />
</section>
<div class="h-40" />
