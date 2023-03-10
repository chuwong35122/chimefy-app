// See https://kit.svelte.dev/docs/types#app
import { Pocketbase, type Record } from 'pocketbase';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: Pocketbase;
			user: Record | undefined;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
