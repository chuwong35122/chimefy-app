import type { User } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import { supabase } from './supabase';
import { browser } from '$app/environment';

export const userStore = writable<User | null>(null);

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
	await supabase.auth.signOut();
	userStore.set(null);
	if (browser) {
		window.localStorage.clear();
		window.sessionStorage.removeItem('sb-auth-token');
		deleteAllCookies();
	}
}
