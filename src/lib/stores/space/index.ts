import type { SpaceMember } from '$lib/types/space/member.interface';
import type { MusicSpace, MusicSpaceRole } from '$lib/types/space/space.interface';
import { writable } from 'svelte/store';

export const spaceStore = writable<MusicSpace>();
export const spaceRoleStore = writable<MusicSpaceRole>('member');

export const spaceMemberStore = writable<SpaceMember[]>([]);
