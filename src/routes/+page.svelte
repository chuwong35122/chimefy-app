<script lang="ts">
	import FaqSection from '$lib/components/landing/FAQSection.svelte';
	import HowToSteps from '../lib/components/landing/HowToSteps.svelte';

	let mousePos = { x: 0, y: 0 };
	function handleMouseMove(e: MouseEvent) {
		mousePos.x = e.pageX;
		mousePos.y = e.pageY;
	}
</script>

<svelte:head>
	<title>Welcome to Chimefy</title>
</svelte:head>

<div on:mousemove={handleMouseMove} class="w-full">
	<section>
		<div class="w-full h-[600px] p-8 relative overflow-hidden">
			<div>
				<h1 class="text-6xl font-extrabold ml-2">Welcome to Chimefy</h1>
			</div>
			<h2 class="ml-4">
				A place to sync <a
					target="_blank"
					rel="noreferrer"
					href="https://www.spotify.com/"
					class="text-primary underline underline-offset-1">Spotify music</a
				> with your friends!
			</h2>
			<div class="absolute bottom-0 right-0">
				<img
					src="/images/landing/friends-listening.png"
					alt="Friends listening to music"
					class="w-[550px] h-[550px] md:w-[720px] md:h-[720px] lg:w-[800px] lg:h-[800px] relative z-50"
				/>
				<div
					class="absolute z-10 right-0 top-[240px] bg-white/40 transform -skew-y-[20deg] skew-x-[10deg] rounded-lg w-[500px] h-[440px]  lg:w-[600px] lg:h-[500px]"
				/>
			</div>
		</div>
	</section>
	<section class="w-full">
		<HowToSteps mousePosX={mousePos.x} mousePosY={mousePos.y} />
	</section>
</div>
<section class="p-8">
	<FaqSection />
</section>
<div class="h-40" />
