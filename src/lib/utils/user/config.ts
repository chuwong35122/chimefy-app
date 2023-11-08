import type { Database } from '$lib/types/database/supabase.types';
import type { UserConfigs } from '$lib/types/user/config.interface';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function updateUserConfig(
	supabase: SupabaseClient<Database>,
	userId: string,
	config: Partial<UserConfigs>
): Promise<UserConfigs | null> {
	const result = await supabase
		.from('user_configs')
		.update(config)
		.eq('config_owner', userId)
		.single();

	return result.data;
}
