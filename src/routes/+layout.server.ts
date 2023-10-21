import type { LayoutServerLoad } from './$types';
import type { UserConfigs } from '$lib/types/user/config.interface';

export const load: LayoutServerLoad = async ({ locals }) => {
	const _session = await locals.getSession();
	let _configs = await locals.getUserConfigs(_session?.user?.id);

	if (!_configs) {
		const { data } = await locals.supabase
			.from('user_configs')
			.insert({
				config_owner: _session?.user.id,
				player_volume: 50
			})
			.select('*')
			.single();
		_configs = data as UserConfigs;
	}

	return {
		session: _session,
		configs: _configs
	};
};
