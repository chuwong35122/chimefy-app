<script lang="ts">
	import FaqSection from '$lib/components/landing/FAQSection.svelte';
	import HowToSteps from '$lib/components/landing/HowToSteps.svelte';
	import UseCase from '$lib/components/landing/UseCase.svelte';
	import seo from '$lib/constants/seo';
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="description" content="Listen to Spotify music together with friends" />
	<meta name="keywords" content="chimefy, spotify, listen together, sync spotify" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content={seo.appTitle} />
	<meta
		property="og:description"
		content={seo.appDescription}
	/>
	<meta property="og:image" content={seo.image} />
	<meta property="og:url" content={seo.appUrl} />
	<meta property="og:type" content="website" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:title" content={seo.appTitle} />
	<meta name="twitter:description" content={seo.appDescription} />
	<meta name="twitter:card" content={seo.twitterCard} />
	<meta name="twitter:image" content={seo.image} />
	<meta name="twitter:image:alt" content={seo.imageAlt} />

	<title>Welcome to Chimefy</title>
</svelte:head>

<div class="w-full">
	<section class="h-[80vh]">
		<div class="grid place-content-center h-[600px] relative overflow-hidden">
			<div class="flex flex-col items-center w-full h-full">
				<h1 class="text-4xl md:text-6xl lg:text-7xl font-extrabold ml-2">
					Welcome to <span class="text-primary">Chimefy </span>
				</h1>
				<UseCase />
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
