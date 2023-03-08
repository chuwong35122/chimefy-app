import { writable } from 'svelte/store';

export type ToastType = 'error' | 'info' | 'warn';
interface ToastValue {
	message: string | undefined;
	type: ToastType | undefined;
}

export const toastValue = writable<ToastValue>({
	message: undefined,
	type: undefined
});
