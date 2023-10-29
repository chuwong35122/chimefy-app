// See https://kit.svelte.dev/docs/types#app
import type { Database } from '$lib/types/database/supabase.types';
import type { UserConfigs } from '$lib/types/user/config.interface';
import { SupabaseClient, type Session } from '@supabase/supabase-js';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			supabase: SupabaseClient<Database>;
			session: Session | null;
		}
		// interface Platform {}
	}
}

export {};
