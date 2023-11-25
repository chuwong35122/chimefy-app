<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
</script>

<div class="w-full">
	<div class="w-full grid place-items-center mb-2">
		<p class="text-3xl font-bold">FAQs</p>
	</div>
	<Accordion defaultClass="w-[440px] md:w-[800px]">
		<AccordionItem>
			<span slot="header" class="text-base flex gap-2">
				<Icon icon="ri:question-fill" class="w-8 h-8" />
				<span>How to use Chimefy?</span>
			</span>
			<p>Using Chimefy is easy! Just follow the steps below</p>
			<br />
			<ol class="list-decimal list-inside ml-8">
				<li>Login to your Spotify Premium account</li>
				<li>Create or join a Space</li>
				<li>Invite your friends with Space's ID</li>
				<li>Play & Listen together!</li>
			</ol>
			<br />
			<span class="text-sm text-dark-300">
				Note: Please refresh if there's bug or error... Sorry for the inconvenience.
			</span>
		</AccordionItem>
		<!-- 2 -->
		<AccordionItem>
			<span slot="header" class="text-base flex gap-2">
				<Icon icon="fluent-emoji-high-contrast:thinking-face" class="w-6 h-6" />
				<span>How does it work (For Nerds)</span>
			</span>
			<p class="mb-2 text-dark-100">
				All the queues added were saved in the database. Once played, using the <a
					aria-label="Spotify API"
					target="_blank"
					rel="noopener noreferrer"
					href="https://developer.spotify.com/documentation/web-api"
					class="underline text-blue-500">Spotify API</a
				>, the song is requested to be played using
				<a
					aria-label="Spotify Web SDK"
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
		<!-- 3 -->
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
		<!-- 4 -->
		<AccordionItem>
			<span slot="header" class="text-base flex gap-2">
				<Icon icon="fa-brands:spotify" class="w-6 h-6" />
				<span>How to get Spotify Premium?</span>
			</span>
			<p class="mb-2 text-dark-100">
				You can select and purchase your premium plan <a
					aria-label="View Spotify Premium Plans"
					target="_blank"
					rel="noopener noreferrer"
					href="https://support.spotify.com/category/plan-help/"
					class="text-blue-500 underline">here</a
				>.
			</p>
		</AccordionItem>
	</Accordion>
</div>
