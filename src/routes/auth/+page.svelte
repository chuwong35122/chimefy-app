<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { Input } from 'flowbite-svelte';
	import PrimaryButton from '../../component/buttons/PrimaryButton.svelte';
	import { LoginValidationSchema } from '../../schema/auth.schema';
	import type { ValidationError } from 'yup';
	import Toast from '../../component/notification/Toast.svelte';

	export let form: { status: number; message: string };
	let showLoginPassword = false;
	let isLoading = false

	let inputErr = '';

	let data = {
		email: '',
		password: ''
	};

	$: if (data) {
		inputErr = '';
	}

	// https://kit.svelte.dev/docs/form-actions#progressive-enhancement-use-enhance
	// https://www.youtube.com/watch?v=doDKaKDvB30
	const handleLogin: SubmitFunction = async ({ form, data, action, cancel }) => {
		const loginInfo = Object.fromEntries([...data]);
		try {
			await LoginValidationSchema.validate(loginInfo, {
				strict: true
			});
			isLoading = true
			await fetch(action, {
				method: 'POST',
				body: data
			});
		} catch (e) {
			const err = e as ValidationError;
			inputErr = err.message;
			isLoading = false
			cancel();
		}
	};
</script>

<!-- <div class="w-[500px]">
		<div class="grid place-items-center p-6 h-full border rounded-2xl">
			<p class="text-4xl">You have already logged in!</p>
			<PrimaryButton on:click={() => goto('/session')} class="mt-4">Go Home</PrimaryButton>
			<div class="my-4 bg-[rgba(255,255,255,0.3)] h-[1px] w-full" />
			<div class="grid place-items-center">
				<p class="text-lg">Or do you want to log out?</p>
				<SecondaryButton on:click={logout} class="mt-2 w-28">Logout</SecondaryButton>
			</div>
		</div>
	</div> -->

<div class="w-[400px]">
	<form method="post" action="?/login" use:enhance={handleLogin}>
		<div class="w-full grid place-items-center">
			<h1 class="text-4xl font-semibold">Login to AppName</h1>
		</div>
		<label for="email">Email</label>
		<Input
			type="email"
			name="email"
			bind:value={data.email}
			placeholder="email"
			color="green"
			class="mb-2"
		/>
		<label for="password">Password</label>
		<Input
			name="password"
			bind:value={data.password}
			placeholder="password"
			color="green"
			class="mb-2"
			type={showLoginPassword ? 'text' : 'password'}
		/>
		<PrimaryButton {isLoading} class="my-2">Login</PrimaryButton>
		<a href="/auth/register" class="underline text-gray-300 text-sm">Create an account</a>
	</form>
	{#if form}
		<div class="w-full grid place-items-center">
			<Toast message={form.message} type='error' />
		</div>
	{/if}
	{#if inputErr}
		<div class="w-full grid place-items-center">
			<Toast message={inputErr} type='error' />
		</div>
	{/if}
</div>

