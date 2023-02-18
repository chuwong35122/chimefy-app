import Pocketbase from 'pocketbase';
import { writable } from 'svelte/store';

const pb = new Pocketbase('http://127.0.0.1:8090');

export const user = writable(pb.authStore.model);

pb.authStore.onChange(() => {
	user.set(pb.authStore.model);
});
