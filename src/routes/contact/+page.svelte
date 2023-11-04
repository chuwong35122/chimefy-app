<script lang="ts">
	import { Alert, Badge, Button, Input, Label, Spinner, Textarea } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import ErrorMessage from '$components/forms/ErrorMessage.svelte';
	import { SendContactSchema } from '$schemas/contact.schema';
	import emailjs from '@emailjs/browser';
	import { toastValue } from '$stores/notification/toast';
	import { fade } from 'svelte/transition';
	import {
		PUBLIC_SERVICE_ID,
		PUBLIC_TEMPLATE_ID,
		PUBLIC_EMAILJS_PUBLIC_KEY
	} from '$env/static/public';
	import { goto } from '$app/navigation';
	import { devModeStore } from '$stores/settings';

	export let data: PageData;
	const { form, errors, validate } = superForm(data.form, {
		validators: SendContactSchema,
		resetForm: false
	});
	let isLoading = false;
	let hasErr = false;

	async function handleMail() {
		isLoading = true;
		await validate('name', { update: true });
		await validate('email', { update: true });
		await validate('subject', { update: true });
		await validate('detail', { update: true });

		if (
			$errors?.email != undefined ||
			$errors?.name != undefined ||
			$errors?.subject != undefined ||
			$errors?.detail != undefined
		) {
			isLoading = false;
			return;
		}

		try {
			const result = await emailjs.send(
				PUBLIC_SERVICE_ID,
				PUBLIC_TEMPLATE_ID,
				{
					name: $form.name,
					email: $form.email,
					subject: $form.subject,
					detail: $form.detail,
					reply_to: $form.email
				},
				PUBLIC_EMAILJS_PUBLIC_KEY
			);
			if (result.status === 200) {
				isLoading = false;
				toastValue.set({
					message: 'Email has been sent!',
					type: 'info'
				});
				goto('/');
			}
		} catch (e) {
			hasErr = true;
			toastValue.set({
				message: 'Email cannot be sent due to an error',
				type: 'error'
			});
		}
	}
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="description" content="Contact Chimefy" />
	<meta name="keywords" content="chimefy, spotify, listen together, contact chimefy" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<title>Contact Chimefy</title>
</svelte:head>

{#if $devModeStore}
	<SuperDebug data={$form} />
{/if}

<div class="w-full h-full grid place-items-center animate-in fade-in slide-in-from-top mt-12">
	<div
		class="flex flex-row items-center rounded-lg bg-glass overflow-hidden w-[400px] md:w-[900px] h-[640px]"
	>
		<!------ Image ------>
		<div
			class="h-full invisible md:visible w-0 md:w-[600px] overflow-hidden cover relative group/cover-img"
		>
			<img
				src="/images/contact/paper-plane.avif"
				alt="Contact us"
				draggable="false"
				class="h-full object-cover hover:scale-105 duration-1000"	
			/>
			<Badge color='dark' rounded class='absolute left-4 bottom-6 invisible group-hover/cover-img:visible'>Image by teravector</Badge>
		</div>
		<!----- Form ------>
		<div class="p-8 w-full h-full flex flex-col justify-between bg-gradient-to-b from-black/10 to-white/5">
			<div class="flex flex-col gap-2">
				<!-- Header -->
				<div class="w-full grid place-items-start">
					<h2 class="text-2xl font-bold">Feel free to contact the project owner!</h2>
					<p class="text-sm text-dark-300">Give feedbacks or request for a new feature.</p>
				</div>
				<!-- Name -->
				<div>
					<Label class='text-white'>Name</Label>
					<Input name="name" bind:value={$form.name} color="green" placeholder="Your name" />
					{#if $errors?.name && $errors.name[0]}
						<ErrorMessage message={$errors?.name[0]} />
					{/if}
				</div>
				<!-- Email -->
				<div>
					<Label class='text-white'>Your Email</Label>
					<Input
						name="email"
						type="email"
						bind:value={$form.email}
						color="green"
						placeholder="What's your email?"
					/>
					{#if $errors?.email && $errors.email[0]}
						<ErrorMessage message={$errors?.email[0]} />
					{/if}
				</div>
				<!-- Subject -->
				<div>
					<Label class='text-white'>Subject</Label>
					<Input
						name="subject"
						bind:value={$form.subject}
						color="green"
						placeholder="State your inquiry (Title)"
					/>
					{#if $errors?.subject && $errors.subject[0]}
						<ErrorMessage message={$errors?.subject[0]} />
					{/if}
				</div>
				<!-- Details -->
				<div>
					<Label class='text-white'>Details</Label>
					<Textarea
						name="detail"
						bind:value={$form.detail}
						placeholder="Details (Please state who you are and your inquiry)"
						rows={5}
						class="bg-green-50 !border-green-500 !ring-0"
					/>
					{#if $errors?.detail && $errors.detail[0]}
						<ErrorMessage message={$errors?.detail[0]} />
					{/if}
				</div>
			</div>
			<button on:click|preventDefault={handleMail}>
				<Button color='primary' class='w-full'>
					{#if isLoading}
					<Spinner color='green' size='6' class='mr-2' />
					{:else}
					<Icon icon="material-symbols:send" class="w-6 h-6 mr-2" />
					{/if}
					<span>Send</span>
				</Button>
			</button>
		</div>
		{#if hasErr}
			<div in:fade>
				<Alert color="yellow">
					<Icon icon="mdi:alert-circle" class="w-6 h-6 mr-2" />
					<span>Email cannot be sent due to rate limit! Try sending it by</span>
					<a href="mailto: chuchuwiiii.dev@gmail.com" class="underline text-blue-500">yourself</a>
				</Alert>
			</div>
		{/if}
	</div>

	<div class="mx-auto">
		<a
			href="https://github.com/chuwong35122/chimefy-app/issues"
			aria-label="Report bugs"
			target="_blank"
			rel="noopener noreferrer"
			class="text-sm">🐞 Report bugs (in Github)</a
		>
	</div>
</div>
