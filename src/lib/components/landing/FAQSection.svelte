<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
</script>

<div class="w-full mt-20">
	<div class="w-full grid place-items-center mb-2">
		<p class="text-3xl font-bold">FAQs</p>
	</div>
	<Accordion defaultClass="w-[440px] md:w-[800px]">
		<!-- 1 -->
		<AccordionItem>
			<span slot="header" class="text-base flex gap-2">
				<Icon icon="fluent-emoji-high-contrast:thinking-face" class="w-6 h-6" />
				<span>How does it work (For Nerds)</span>
			</span>
			<p class="mb-2 text-dark-100">
				All the queues added were saved in the database. Once played, using the <a
					target="_blank"
					rel="noopener noreferrer"
					href="https://developer.spotify.com/documentation/web-api"
					class="underline text-blue-500">Spotify API</a
				>, the song is requested to be played using
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="https://developer.spotify.com/documentation/web-playback-sdk"
					class="underline text-blue-500">Spotify Web SDK</a
				>. To be able to use this app, Spotify premium is needed (as required by Spotify).
				<br />
				<br />
				<span class="text-sm">
					Note: that Chimefy did not broadcast the music, it only syncs the music between the users.
				</span>
			</p>
		</AccordionItem>
		<!-- 2 -->
		<AccordionItem>
			<span slot="header" class="text-base flex gap-2">
				<Icon icon="mdi:account" class="w-6 h-6" />
				<span>Who is this app for?</span>
			</span>
			<p class="mb-2 text-dark-100">
				This app is for Premium Spotify users who wanted to listen to Spotify with friends, family,
				with any amount of members!
			</p>
		</AccordionItem>
		<!-- 3 -->
		<AccordionItem>
			<span slot="header" class="text-base flex gap-2">
				<Icon icon="fa-brands:spotify" class="w-6 h-6" />
				<span>How to get Spotify Premium?</span>
			</span>
			<p class="mb-2 text-dark-100">
				You can select and purchase your premium plan <a
					target="_blank"
					rel="noopener noreferrer"
					href="https://support.spotify.com/category/plan-help/"
					class="text-blue-500 underline">here</a
				>.
			</p>
		</AccordionItem>
	</Accordion>
</div>
