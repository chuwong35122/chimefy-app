import type { MusicQueueSpace, MusicSessionRole } from '$interfaces/session/session.interface';
import { writable } from 'svelte/store';

export const spaceStore = writable<MusicQueueSpace | null>(null);
export const spaceRoleStore = writable<MusicSessionRole>('member');
