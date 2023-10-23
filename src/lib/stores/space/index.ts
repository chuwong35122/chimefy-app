import type { SessionMember } from '$lib/types/session/member.interface';
import type { MusicQueueSpace, MusicSessionRole } from '$lib/types/session/session.interface';
import { writable } from 'svelte/store';

export const spaceStore = writable<MusicQueueSpace>();
export const spaceRoleStore = writable<MusicSessionRole>('member');

export const spaceMemberStore = writable<SessionMember[]>([]);
