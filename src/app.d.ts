// See https://kit.svelte.dev/docs/types#app
import { Pocketbase, type Record } from 'pocketbase';
import { SupabaseClient, type Session } from '@supabase/supabase-js';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: Pocketbase;
			user: Record | undefined;
			supabase: SupabaseClient;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Platform {}
	}
}

export {};
