<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { Input } from 'flowbite-svelte';
	import Toast from '../../../component/notification/Toast.svelte';
	import PrimaryButton from '../../../component/buttons/PrimaryButton.svelte';
	import { SignupValidationSchema } from '../../../schema/auth.schema';
	import type { ValidationError } from 'yup';

	export let form: { status: number; message: string };

	let showSignupPassword = false;

	export let formErr = '';
	let signupData = {
		email: '',
		password: '',
		passwordConfirm: ''
	};

	const handleSignup: SubmitFunction = async ({ form, data, action, cancel }) => {
		const signupInfo = Object.fromEntries([...data]);
		try {
			await SignupValidationSchema.validate(signupInfo, {
				strict: true
			});
			await fetch(action, {
				method: 'POST',
				body: data
			});
		} catch (e) {
			const err = e as ValidationError;
			formErr = err.message;
			cancel();
		}
	};

	$: if (signupData) {
		formErr = '';
	}
</script>

<div class="w-[400px]">
	<div class="grid place-items-center">
		<h1 class="text-4xl font-bold">Register to AppName</h1>
	</div>
	<form method="POST" action="?/register" use:enhance={handleSignup}>
		<div class="rounded-xl">
			<label for="email">Email</label>
			<Input
				name="email"
				bind:value={signupData.email}
				placeholder="Email"
				color="green"
				class="mb-2"
			/>
			<label for="email">Password</label>
			<Input
				name="password"
				bind:value={signupData.password}
				placeholder="Password"
				color="green"
				class="mb-2"
				type={showSignupPassword ? 'text' : 'password'}
			/>
			<label for="email">Confirm password</label>
			<Input
				name="passwordConfirm"
				bind:value={signupData.passwordConfirm}
				placeholder="Confirm Password"
				color="green"
				class="mb-2"
				type={showSignupPassword ? 'text' : 'password'}
			/>
			<PrimaryButton class="my-2">Sign up</PrimaryButton>
			<a href="/auth" class='underline text-gray-300 text-sm'>Want to Login?</a>
		</div>
	</form>
	{#if formErr}
		<Toast message={formErr} type="error" />
	{/if}
	{#if form}
		<Toast message={form.message} type="error" />
	{/if}
</div>
