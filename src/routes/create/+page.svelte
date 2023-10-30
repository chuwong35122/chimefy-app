<script lang="ts">
	import { Label, Input, Select, Tooltip, Button, GradientButton } from 'flowbite-svelte';
	import { SESSION_MUSIC_TYPES } from '$constants/types';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import ErrorMessage from '$components/forms/ErrorMessage.svelte';
	import { goto } from '$app/navigation';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import Icon from '@iconify/svelte';
	import seo from '$constants/seo';
	import { devModeStore } from '$stores/settings';

	export let data: PageData;
	const { form, errors, delayed } = superForm(data.form, {
		resetForm: false,
		defaultValidator: 'keep',
		clearOnSubmit: 'none'
	});

	const musicSessionTypes = SESSION_MUSIC_TYPES.map((type) => ({
		name: type,
		value: type
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

<div class="p-10 bg-white/5 rounded-2xl duration-150 hover:bg-white/10 w-[500px] mt-20">
	{#if $devModeStore}
		<SuperDebug data={$form} />
	{/if}

	<Tooltip triggeredBy="[id=private-info]" placement="right">
		Private session will not be shown on the search section.
	</Tooltip>
	<Tooltip triggeredBy="[id=allow-queue-info]" placement="right">
		Do you want to allow your members to add track(s) to the queue?
	</Tooltip>

	<form class="flex flex-col space-y-6" method="POST">
		<h3 class="text-2xl font-semibold text-white p-0">Create Your Session</h3>
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
				<ErrorMessage message={$errors?.name[0]} />
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
				<ErrorMessage message={$errors?.type[0]} />
			{/if}
		</Label>
		<div class="flex flex-row items-center">
			<input
				type="checkbox"
				name="is_private"
				color="green"
				bind:checked={$form.is_private}
				class="text-primary mr-2 rounded-sm"
			/>
			<p>Set this session private?</p>
			<Icon
				icon="material-symbols:info"
				id="private-info"
				class="text-gray-400 hover:text-gray-200 duration-150 ml-2"
			/>
		</div>
		<div class="flex flex-row items-center">
			<input
				type="checkbox"
				name="allow_member_queue"
				color="green"
				bind:checked={$form.allow_member_queue}
				class="text-primary mr-2 rounded-sm"
			/>
			<p>Allow member to set queue?</p>
			<Icon
				icon="material-symbols:info"
				id="allow-queue-info"
				class="text-gray-400 hover:text-gray-200 duration-150 ml-2"
			/>
		</div>
		<GradientButton type="submit" disabled={$delayed} color="green" pill
			>Create Session</GradientButton
		>
		<Button type="button" on:click={() => goto('/session')} color="alternative" pill class="w-full"
			>Go Back</Button
		>
	</form>
</div>
