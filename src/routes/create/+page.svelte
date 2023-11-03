<script lang="ts">
	import { Label, Input, Select, Tooltip, Button, GradientButton } from 'flowbite-svelte';
	import { SPACE_MUSIC_TYPES } from '$constants/types';
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

	const musicSpaceTypes = SPACE_MUSIC_TYPES.map((type) => ({
		name: type,
		value: type
	}));
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="description" content="Create a Space" />
	<meta
		name="keywords"
		content="chimefy, spotify, listen together, join space, create space, public space, private space"
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content={seo.createSpace.title} />
	<meta
		property="og:description"
		content="Create your own space with unlimited number of members and sync all your Spotify music in real-time"
	/>
	<meta property="og:image" content={seo.image} />
	<meta property="og:url" content={seo.createSpace.url} />
	<meta property="og:type" content="website" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:title" content={seo.createSpace.title} />
	<meta name="twitter:description" content={seo.space.description} />
	<meta name="twitter:card" content={seo.twitterCard} />
	<meta name="twitter:image" content={seo.image} />
	<meta name="twitter:image:alt" content={seo.imageAlt} />

	<title>Create a space</title>
</svelte:head>

<div class="w-full grid place-items-center mt-4">
	<div class="p-8 bg-glass rounded-2xl duration-150 hover:bg-white/[0.08] w-[500px]">
		{#if $devModeStore}
			<SuperDebug data={$form} />
		{/if}

		<Tooltip triggeredBy="[id=private-info]" placement="right">
			Private space will not be shown on the search section.
		</Tooltip>
		<Tooltip triggeredBy="[id=allow-queue-info]" placement="right">
			Do you want to allow your members to add track(s) to the queue?
		</Tooltip>

		<form class="flex flex-col space-y-3" method="POST">
			<h3 class="text-2xl font-semibold text-primary-500 text-center">Create a Space</h3>
			<div class="m-auto w-full">
				<div class="w-full grid place-items-center space-y-2">
					<div class="w-24 h-24 m-auto rounded-md bg-white grid place-items-center overflow-hidden">
						{#if $form.cover_image}
							<img src={$form.cover_image} alt="Space Cover" class="object-cover w-24 h-24" />
						{:else}
							<Icon icon="material-symbols:image-rounded" class="w-20 h-20 text-dark-500" />
						{/if}
					</div>
					<a href="https://unsplash.com/" target="_blank" class="text-xs"
						>Browse from <span class="text-primary underline">Unsplash</span></a
					>
				</div>
			</div>
			<Label class="space-y-2">
				<span class="text-white">Cover Image</span>
				<Input
					bind:value={$form.cover_image}
					name="cover_image"
					type="url"
					placeholder="Image URL"
					required
					color="green"
				/>
				{#if $errors?.cover_image && $errors.cover_image[0]}
					<ErrorMessage message={$errors?.cover_image[0]} />
				{/if}
			</Label>
			<Label class="space-y-2">
				<span class="text-white">Your space name</span>
				<Input
					bind:value={$form.name}
					name="name"
					type="text"
					placeholder="Space Name"
					required
					color="green"
				/>
				{#if $errors?.name && $errors.name[0]}
					<ErrorMessage message={$errors?.name[0]} />
				{/if}
			</Label>
			<Label class="space-y-2">
				<span class="text-white">Your space description</span>
				<Input
					bind:value={$form.description}
					name="description"
					type="text"
					placeholder="Some description about your music or space"
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
					items={musicSpaceTypes}
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
				<p>Set this space private?</p>
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
				>Create Space</GradientButton
			>
			<Button type="button" on:click={() => goto('/space')} color="alternative" pill class="w-full"
				>Go Back</Button
			>
		</form>
	</div>
</div>
