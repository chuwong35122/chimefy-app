import { writable } from 'svelte/store';

export const devModeStore = writable<boolean>(false);
