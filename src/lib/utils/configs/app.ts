import type { Database } from '$lib/types/database/supabase.types';
import type { UserConfigs } from '$lib/types/user/config.interface';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function getAppConfig(supabase: SupabaseClient<Database>, userID: string) {
	const { data } = await supabase
		.from('user_configs')
		.select('*')
		.eq('config_owner', userID)
		.single();

	return data as UserConfigs;
}

export async function createAppConfig(supabase: SupabaseClient<Database>, userID: string) {
	const _config = await getAppConfig(supabase, userID);
	if (_config) return _config;

	const { data } = await supabase
		.from('user_configs')
		.insert({
			config_owner: userID,
			player_volume: 50
		})
		.select('*')
		.single();

	return data as UserConfigs;
}
