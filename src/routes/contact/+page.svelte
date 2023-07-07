<script lang="ts">
	import { Alert, Input, Label, Textarea } from 'flowbite-svelte';
	import PrimaryButtonWrapper from '$lib/components/buttons/PrimaryButtonWrapper.svelte';
	import Icon from '@iconify/svelte';
	import { PUBLIC_NODE_ENV } from '$env/static/public';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import ErrorMessage from '$lib/components/forms/ErrorMessage.svelte';
	import { SendContactSchema } from '$lib/schema/contact.schema';
	import emailjs from '@emailjs/browser';
	import { toastValue } from '$lib/notification/toast';
	import { fade } from 'svelte/transition';
	import {
		PUBLIC_SERVICE_ID,
		PUBLIC_TEMPLATE_ID,
		PUBLIC_EMAILJS_PUBLIC_KEY
	} from '$env/static/public';
	import { goto } from '$app/navigation';

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
	<meta charset="UTF-8">
  <meta name="description" content="Contact Chimefy">
  <meta name="keywords" content="chimefy, spotify, listen together, contact chimefy">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

	<title>Contact Chimefy</title>
</svelte:head>

{#if PUBLIC_NODE_ENV === 'development'}
	<SuperDebug data={$form} />
{/if}

<div class="mt-20 w-[600px] flex flex-col items-center">
	<h1 class="text-4xl font-bold mb-4">Contact</h1>

	<div
		class="flex flex-row items-center rounded-2xl w-[400px] md:w-[900px] h-[640px] overflow-hidden"
	>
		<div
			class="h-full invisible md:visible w-0 md:w-[600px] overflow-hidden cover relative group/cover-img"
		>
			<img
				src="/images/contact/paper-plane.avif"
				alt="Contact us"
				class="h-full object-cover hover:scale-110 duration-[2000ms] transform-o"
			/>
			<div
				class="invisible absolute right-[50%] bottom-6 bg-black/30 rounded-full p-2 group-hover/cover-img:visible"
			>
				Image by teravector
			</div>
		</div>
		<div class="flex flex-col gap-2 text-black bg-white p-8 w-full h-full">
			<div class="w-full grid place-items-start">
				<h2 class="text-2xl font-bold">Feel free to contact the developer!</h2>
				<p>Give feedbacks, request for a new feature, or just contact!</p>
			</div>
			<Label>Name</Label>
			<Input name="name" bind:value={$form.name} color="green" placeholder="Your name" />
			{#if $errors?.name && $errors.name[0]}
				<ErrorMessage message={$errors?.name[0]} showBorder={false} />
			{/if}
			<Label>Your Email</Label>
			<Input
				name="email"
				type="email"
				bind:value={$form.email}
				color="green"
				placeholder="What's your email?"
			/>
			{#if $errors?.email && $errors.email[0]}
				<ErrorMessage message={$errors?.email[0]} showBorder={false} />
			{/if}
			<Label>Subject</Label>
			<Input
				name="subject"
				bind:value={$form.subject}
				color="green"
				placeholder="State your inquiry (Title)"
			/>
			{#if $errors?.subject && $errors.subject[0]}
				<ErrorMessage message={$errors?.subject[0]} showBorder={false} />
			{/if}
			<Label>Details</Label>
			<Textarea
				name="detail"
				bind:value={$form.detail}
				placeholder="Details (Please state who you are and your inquiry)"
				rows={5}
				class="bg-green-50 !border-green-500 !ring-0"
			/>
			{#if $errors?.detail && $errors.detail[0]}
				<ErrorMessage message={$errors?.detail[0]} showBorder={false} />
			{/if}
			<button on:click|preventDefault={handleMail}>
				<PrimaryButtonWrapper {isLoading}>
					<div class="flex flex-row items-center justify-center">
						<span>Send</span>
						<Icon icon="material-symbols:send" class="text-white w-6 h-6 ml-2" />
					</div>
				</PrimaryButtonWrapper>
			</button>

			{#if hasErr}
				<div in:fade>
					<Alert color="yellow">
						<Icon icon="mdi:alert-circle" class="w-6 h-6 mr-2" />
						<span>Seems like the email cannot be sent due to some error... Try sending it by</span>
						<a href="mailto: chuchuwiiii.dev@gmail.com" class="underline text-blue-500">yourself</a>
					</Alert>
				</div>
			{/if}
		</div>
	</div>

	<div class="flex flex-row items-center my-4">
		<a href="/contact/report-bug" target="_blank" rel="noopener noreferrer" class="underline"
			>Report bugs?</a
		>
	</div>
</div>
