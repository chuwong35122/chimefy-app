<script lang="ts">
	import { Button, ButtonGroup, Input, InputAddon, TabItem, Tabs, Tooltip } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	import { toastValue } from '$stores/notification/toast';
	import SessionList from '$components/session/SessionList.svelte';
	import type { MusicSession, MusicSessionInfo } from '$interfaces/session/session.interface';
	import { supabase } from '$supabase/supabase';
	import { fly } from 'svelte/transition';
	import { userStore } from '$stores/auth/user';
	import SessionItem from '$components/session/SessionItem.svelte';
	import { listUserSession } from '$utils/session/search';
	import seo from '$constants/seo';

	let input = '';
	let privateSessions: MusicSessionInfo[] = [];

	async function enterSession() {
		try {
			const { data } = await supabase.from('session').select().eq('uuid', input);

			const session = (data as any)[0] as MusicSession;
			if (session.uuid) {
				goto(`/session/${session.uuid}`);
			}
		} catch (e) {
			toastValue.set({ message: 'Session not found', type: 'error' });
		}
	}

	userStore.subscribe(async (user) => {
		if (user?.id && privateSessions.length === 0) {
			const session = await listUserSession(user?.id);
			privateSessions = session;
		}
	});
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="description" content="Join a Session" />
	<meta
		name="keywords"
		content="chimefy, spotify, listen together, join session, create session, public session, private session"
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content={seo.session.title} />
	<meta
		property="og:description"
		content="Create your own session with unlimited number of members and sync all your Spotify music in real-time"
	/>
	<meta property="og:image" content={seo.image} />
	<meta property="og:url" content={seo.appUrl} />
	<meta property="og:type" content="website" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:title" content={seo.session.title} />
	<meta name="twitter:description" content={seo.session.description} />
	<meta name="twitter:card" content={seo.twitterCard} />
	<meta name="twitter:image" content={seo.image} />
	<meta name="twitter:image:alt" content={seo.imageAlt} />

	<title>Join a Session</title>
</svelte:head>

<div in:fly={{ y: 10, duration: 200 }} class="rounded-2xl grid place-items-center mt-20">
	<h1 class="text-4xl text-primary-500 font-semibold">Join a Session</h1>
	<div class="my-4" />

	<form on:submit|preventDefault={enterSession}>
		<ButtonGroup size="lg" class="w-full focus:shadow-lg focus:shadow-white">
			<InputAddon
				class="bg-dark !border-2 !border-r-0 !rounded-l-full border-white"
			>
				<Icon icon="material-symbols:meeting-room-rounded" width={32} height={32} />
			</InputAddon>
			<Input
				bind:value={input}
				placeholder="Session ID"
				defaultClass="w-[180px] md:w-[400px] lg:w-[460px] text-sm md:text-lg lg:text-xl !text-white !border-white border-2 !bg-dark !border-l-0 !border-r-0 placeholder:text-[rgba(255,255,255,0.4)] text-white"
			/>
			<Button
				type="submit"
				color="none"
				aria-label="Enter Session"
				id="search-btn"
				class='bg-dark border-white px-4 border-2 border-l-0 !rounded-r-full duration-200'
				
			>
				<Icon icon="mdi:location-enter" width={32} height={32} />
			</Button>
			<Tooltip triggeredBy="[id=search-btn]" placement="right">Search</Tooltip>
		</ButtonGroup>
	</form>
	<div class="h-6" />
	<div class="w-full grid place-items-center">
		<button
			on:click={() => goto('/create')}
			class="text-sm text-dark-200 font-light hover:text-white duration-200 underline underline-offset-2"
			>Create new music session</button
		>
	</div>

	<div class="mt-20 w-[400px] md:w-[500px] lg:w-[600px]">
		<Tabs style="underline" contentClass="bg-dark-900 p-0">
			<TabItem
				open
				title="Public Sessions"
				activeClasses="text-primary"
				inactiveClasses="text-white/70 p-2"
			>
				<div class="grid place-items-center">
					<SessionList />
				</div>
			</TabItem>
			<TabItem title="My Sessions" activeClasses="text-primary" inactiveClasses="text-white/70 p-2">
				<div class="w-full">
					{#each privateSessions as pSession, i}
						<SessionItem session={pSession} index={i} isPrivate={pSession?.is_private} />
					{/each}
				</div>
			</TabItem>
		</Tabs>
	</div>
</div>
