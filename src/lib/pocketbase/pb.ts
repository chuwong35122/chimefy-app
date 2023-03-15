import Pocketbase from 'pocketbase';
import { writable } from 'svelte/store';
import { PUBLIC_POCKETBASE_API_URL } from '$env/static/public';
import { spotifyToken, spotifyUser } from '$lib/spotify/spotify';

export const pb = new Pocketbase(PUBLIC_POCKETBASE_API_URL);

export const user = writable(pb.authStore.model);

pb.authStore.onChange((val) => {
	user.set(pb.authStore.model);
});

export function logout() {
	pb.authStore.clear();
	spotifyToken.set(undefined);
	spotifyUser.set(undefined);
}