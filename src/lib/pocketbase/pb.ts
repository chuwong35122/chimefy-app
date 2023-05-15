import Pocketbase from 'pocketbase';
import { writable } from 'svelte/store';
import { PUBLIC_POCKETBASE_API_URL } from '$env/static/public';
import { spotifyAccessToken, spotifyUser } from '$lib/spotify/spotify';
import { browser } from '$app/environment';

export const pb = new Pocketbase(PUBLIC_POCKETBASE_API_URL);

export const user = writable(pb.authStore.model);

pb.authStore.onChange((val) => {
	user.set(pb.authStore.model);
});

export function logout() {
	pb.authStore.clear();
	spotifyAccessToken.set('');
	spotifyUser.set(undefined);
	if (browser) {
		window.localStorage.clear();
	}
}
