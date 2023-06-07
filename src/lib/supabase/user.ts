import type { User } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import { supabase } from './supabase';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { toastValue } from '$lib/notification/toast';
import { SPOTIFY_AUTH_SCOPES } from '$lib/spotify/spotify';

export const userStore = writable<User | null>(null);

export async function reloginAfterTokenRefreshed(redirectTo: URL) {
	console.log('Reloggin');
	const { data } = await supabase.auth.signInWithOAuth({
		provider: 'spotify',
		options: {
			scopes: SPOTIFY_AUTH_SCOPES.join(' '),
			redirectTo: redirectTo.href
		}
	});

	if (data && data?.url) {
		goto(data.url);
	}
}

function deleteAllCookies() {
	const cookies = document.cookie.split(';');

	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i];
		const eqPos = cookie.indexOf('=');
		const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
		document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
	}
}

export async function logout() {
	const { error } = await supabase.auth.signOut();
	if (error) {
		toastValue.set({ message: 'Cannot signout due to error', type: 'error' });
		return;
	}
	userStore.set(null);
	await goto('/');
	if (browser) {
		window.localStorage.clear();
		window.sessionStorage.removeItem('sb-auth-token');
		deleteAllCookies();
	}
}
