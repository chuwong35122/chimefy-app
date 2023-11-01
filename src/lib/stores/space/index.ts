import type { SpaceMember } from '$lib/types/space/member.interface';
import type { MusicQueueSpace, MusicSpaceRole } from '$lib/types/space/space.interface';
import { writable } from 'svelte/store';

export const spaceStore = writable<MusicQueueSpace>();
export const spaceRoleStore = writable<MusicSpaceRole>('member');

export const spaceMemberStore = writable<SpaceMember[]>([]);
