import { writable } from 'svelte/store';

export const devModeStore = writable<boolean>(false);
export const tutorialStore = writable<boolean>(false);
