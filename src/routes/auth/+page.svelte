<script lang="ts">
	import { goto } from '$app/navigation';
	import { logout, pb, user } from '$lib/pocketbase/pb';
	import { Input, Modal } from 'flowbite-svelte';
	import type { ClientResponseError } from 'pocketbase';
	import PrimaryButton from '../../component/buttons/PrimaryButton.svelte';
	import SecondaryButton from '../../component/buttons/SecondaryButton.svelte';
	import { LoginValidationSchema, SignupValidationSchema } from '../../schema/auth.schema';

	let showSignup = false;
	let showLoginPassword = false;
	let showSignupPassword = false;

	let loginErr = '';
	let signupErr = '';

	let loginData = {
		email: '',
		password: ''
	};

	let signupData = {
		email: '',
		password: '',
		passwordConfirm: ''
	};

	$: if (showSignup) {
		signupErr = '';
		signupData = {
			email: '',
			password: '',
			passwordConfirm: ''
		};
	}

	async function login() {
		loginErr = '';
		try {
			await LoginValidationSchema.validate(loginData, {
				strict: true
			});
		} catch (e: any) {
			loginErr = e.message ?? '';
		}

		try {
			await pb.collection('users').authWithPassword(loginData.email, loginData.password);
		} catch (e) {
			const err = e as ClientResponseError;
			console.log(err.data);
			console.log(err.name);

			if (err.data.code === 400) {
				loginErr = 'Please check your login credential';
			}
		}
	}

	async function signup() {
		signupErr = '';
		try {
			await SignupValidationSchema.validate(signupData, {
				strict: true
			});
		} catch (e: any) {
			signupErr = e.message ?? '';
		}

		try {
			await pb.collection('users').create(signupData);
			await pb.collection('users').authWithPassword(signupData.email, signupData.password);
			goto('/session');
		} catch (e) {
			const err = e as ClientResponseError;
			signupErr = err.message;
		}
	}
</script>

{#if $user?.id}
	<div class="w-[500px]">
		<div class="grid place-items-center p-6 h-full border rounded-2xl">
			<p class="text-4xl">You have already logged in!</p>
			<PrimaryButton on:click={() => goto('/session')} class="mt-4">Go Home</PrimaryButton>
			<div class='my-4 bg-[rgba(255,255,255,0.3)] h-[1px] w-full' />
			<div class="grid place-items-center">
				<p class="text-lg">Or do you want to log out?</p>
				<SecondaryButton on:click={logout} class="mt-2 w-28">Logout</SecondaryButton>
			</div>
		</div>
	</div>
{:else}
	<form on:submit|preventDefault={login}>
		<div class="w-[400px]">
			<h1 class="text-4xl font-semibold mb-8">Login to AppName</h1>
			<Input bind:value={loginData.email} placeholder="email" color="green" class="mb-2" />
			<Input
				bind:value={loginData.password}
				placeholder="password"
				color="green"
				class="mb-2"
				type={showLoginPassword ? 'text' : 'password'}
			/>
			<p class="text-red-500 text-sm my-2">{loginErr}</p>
			<input
				type="submit"
				value="Submit"
				class="bg-primary p-2 w-full hover:bg-primary-400 duration-200 rounded-full uppercase"
			/>
			<button class="text-sm" on:click={() => (showSignup = true)}>Create an account</button>
		</div>
	</form>

	<Modal title="Sign Up" bind:open={showSignup} autoclose={false} class="bg-dark">
		<form on:submit|preventDefault={signup}>
			<div class="p-4 grid place-items-center rounded-xl">
				<div class="w-[400px]">
					<Input bind:value={signupData.email} placeholder="Email" color="green" class="mb-2" />
					<Input
						bind:value={signupData.password}
						placeholder="Password"
						color="green"
						class="mb-2"
						type={showSignupPassword ? 'text' : 'password'}
					/>
					<Input
						bind:value={signupData.passwordConfirm}
						placeholder="Confirm Password"
						color="green"
						class="mb-2"
						type={showSignupPassword ? 'text' : 'password'}
					/>
					<p class="text-red-500 text-sm my-2">{signupErr}</p>
					<input
						type="submit"
						value="Sign Up"
						class="bg-primary p-2 w-full text-white hover:bg-primary-400 duration-200 rounded-full uppercase"
					/>
				</div>
			</div>
		</form>
	</Modal>
{/if}
