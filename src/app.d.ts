// See https://kit.svelte.dev/docs/types#app
import type { Database } from '$interfaces/database/database.interface';
import { SupabaseClient, type Session } from '@supabase/supabase-js';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
			pathName: string;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Platform {}
	}
}

export {};
