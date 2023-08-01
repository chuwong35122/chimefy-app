<script lang="ts">
	import { Label, Input, Toggle, Select, Tooltip } from 'flowbite-svelte';
	import PrimaryButtonWrapper from '$components/buttons/PrimaryButtonWrapper.svelte';
	import { SESSION_MUSIC_TYPES } from '$constants/types';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import ErrorMessage from '$components/forms/ErrorMessage.svelte';
	import SecondaryButtonWrapper from '$components/buttons/SecondaryButtonWrapper.svelte';
	import { goto } from '$app/navigation';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import Icon from '@iconify/svelte';
	import seo from '$constants/seo';
	import { applyAction, enhance } from '$app/forms';
	import { devModeStore } from '$stores/settings';

	export let data: PageData;
	const { form, errors } = superForm(data.form);

	let loading = false;

	const musicSessionTypes = SESSION_MUSIC_TYPES.map((type) => ({
		name: type.name,
		value: type.name
	}));
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="description" content="Create a Session" />
	<meta
		name="keywords"
		content="chimefy, spotify, listen together, join session, create session, public session, private session"
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content={seo.createSession.title} />
	<meta
		property="og:description"
		content="Create your own session with unlimited number of members and sync all your Spotify music in real-time"
	/>
	<meta property="og:image" content={seo.image} />
	<meta property="og:url" content={seo.createSession.url} />
	<meta property="og:type" content="website" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:title" content={seo.createSession.title} />
	<meta name="twitter:description" content={seo.session.description} />
	<meta name="twitter:card" content={seo.twitterCard} />
	<meta name="twitter:image" content={seo.image} />
	<meta name="twitter:image:alt" content={seo.imageAlt} />

	<title>Create a Session</title>
</svelte:head>

<div class="p-10 bg-white/5 rounded-2xl duration-150 hover:bg-white/10 w-[500px]">
	{#if $devModeStore}
		<SuperDebug data={$form} />
	{/if}

	<Tooltip triggeredBy="[id=private-info]" placement="right">
		Private session will not be shown on the search section.
	</Tooltip>
	<Tooltip triggeredBy="[id=allow-queue-info]" placement="right">
		Do you want to allow your members to add track(s) to the queue?
	</Tooltip>

	<form
		class="flex flex-col space-y-6"
		method="POST"
		use:enhance={() => {
			loading = true;

			return async ({ result, update }) => {
				await applyAction(result);
				await update();
				if (result) {
					loading = false;
				}
			};
		}}
	>
		<h3 class="text-4xl font-semibold text-white p-0">Create Your Session</h3>
		<Label class="space-y-2">
			<span class="text-white">Your session name</span>
			<Input
				bind:value={$form.name}
				name="name"
				type="text"
				placeholder="Session Name"
				required
				color="green"
			/>
			{#if $errors?.name && $errors.name[0]}
				<ErrorMessage message={$errors?.name[0]} showBorder={false} />
			{/if}
		</Label>
		<Label>
			<span class="text-white">Music Type</span>
			<Select
				name="type"
				underline
				bind:value={$form.type}
				placeholder="Select music type"
				items={musicSessionTypes}
				class="!text-white mb-2"
			/>
			{#if $errors?.type}
				<ErrorMessage message={$errors?.type[0]} showBorder={false} />
			{/if}
		</Label>
		<div class="flex flex-row items-center">
			<Toggle name="is_private" color="green" bind:checked={$form.is_private} class="text-white"
				>Set this session private?</Toggle
			>
			<Icon
				icon="material-symbols:info"
				id="private-info"
				class="text-gray-400 hover:text-gray-200 duration-150 ml-2"
			/>
		</div>
		<div class="flex flex-row items-center">
			<Toggle
				name="is_private"
				color="green"
				bind:checked={$form.allow_member_queue}
				class="text-white">Allow member to set queue?</Toggle
			>
			<Icon
				icon="material-symbols:info"
				id="allow-queue-info"
				class="text-gray-400 hover:text-gray-200 duration-150 ml-2"
			/>
		</div>
		<button aria-label="Create session" disabled={loading}>
			<PrimaryButtonWrapper isLoading={loading}>Create Session!</PrimaryButtonWrapper>
		</button>
	</form>
	<button on:click={() => goto('/session')} aria-label="Go back" class="w-full my-4">
		<SecondaryButtonWrapper>Go Back</SecondaryButtonWrapper>
	</button>
</div>
