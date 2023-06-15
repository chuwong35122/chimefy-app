// See https://kit.svelte.dev/docs/types#app
import { SupabaseClient, type Session } from '@supabase/supabase-js';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			getSession(): Promise<Session | null>;
			pathName: string;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Platform {}

		interface Error {
			message: string;
		}
	}
}

export {};
