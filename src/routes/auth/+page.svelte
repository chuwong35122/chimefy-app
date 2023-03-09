<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { Input } from 'flowbite-svelte';
	import PrimaryButton from '../../component/buttons/PrimaryButton.svelte';
	import { LoginValidationSchema } from '../../lib/schema/auth.schema';
	import type { ValidationError } from 'yup';
	import { toastValue } from '$lib/notification/toast';
	
		let showLoginPassword = false;
		let isLoading = false

	export let form: { status: number; message: string };
	$: if(form?.status === 400) {
		toastValue.set({message: form?.message, type: 'error'})
		isLoading = false;
	}else if(form?.status === 200) {
		toastValue.set({message: form?.message, type: 'info'})
	}

	let data = {
		email: '',
		password: ''
	};

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
			isLoading = false
		} catch (e) {
			const err = e as ValidationError;
			toastValue.set({message: err.message, type: 'error'})
			isLoading = false
			cancel();
		}
	};
</script>

<div class="w-[400px]">
	<form method="post" use:enhance={handleLogin}>
		<div class="w-full grid place-items-center">
			<h1 class="text-4xl font-semibold">Login to AppName</h1>
		</div>
		<label for="email">Email</label>
		<Input
			type="email"
			name="email"
			required
			bind:value={data.email}
			placeholder="email"
			color="green"
			class="mb-2"
		/>
		<label for="password">Password</label>
		<Input
			name="password"
			required
			bind:value={data.password}
			placeholder="password"
			color="green"
			class="mb-2"
			type={showLoginPassword ? 'text' : 'password'}
		/>
		<PrimaryButton {isLoading} class="my-2">Login</PrimaryButton>
		<a href="/auth/register" class="underline text-gray-300 text-sm">Create an account</a>
	</form>
</div>

