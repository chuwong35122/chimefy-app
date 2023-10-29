import type { UserConfigs } from '$lib/types/user/config.interface';
import type { User } from '@supabase/supabase-js';
import { writable } from 'svelte/store';

export const userStore = writable<User | null>(null);
export const userConfigStore = writable<UserConfigs>();
