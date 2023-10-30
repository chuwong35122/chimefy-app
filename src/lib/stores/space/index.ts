import type { SpaceMember } from '$lib/types/session/member.interface';
import type { MusicQueueSpace, MusicSpaceRole } from '$lib/types/session/session.interface';
import { writable } from 'svelte/store';

export const spaceStore = writable<MusicQueueSpace>();
export const spaceRoleStore = writable<MusicSpaceRole>('member');

export const spaceMemberStore = writable<SpaceMember[]>([]);
