<script lang="ts">
	import FaqSection from '$components/landing/FAQSection.svelte';
	import UseCase from '$components/landing/UseCase.svelte';
</script>

<div class="w-full">
	<section class="h-[70vh]">
		<div class="grid place-content-center h-[600px] relative overflow-hidden">
			<div class="flex flex-col items-center w-full h-full">
				<h1 class="text-4xl md:text-6xl lg:text-7xl font-extrabold ml-2">
					Welcome to <span class="text-primary">Chimefy</span>
				</h1>
				<UseCase />
			</div>
		</div>
	</section>
</div>
<section id="faq" class="p-8">
	<FaqSection />
</section>
<div class="h-40" />
