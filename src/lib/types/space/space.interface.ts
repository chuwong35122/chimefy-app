import type { MusicQueue } from './queue.interface';

export type MusicSpaceRole = 'admin' | 'member';

export interface CreateMusicSpace {
	id?: number;
	created_at?: Date;
	uuid?: string;
	name: string;
	is_private: boolean;
	type: string;
	queues: MusicQueue[];
	created_by: string;
	allow_member_queue: boolean;
}
export interface MusicSpace {
	id: number;
	uuid: string;
	created_at: Date;
	name: string;
	description: string | null;
	cover_image: string | null;
	is_private: boolean;
	type: string;
	created_by: string;
	allow_member_queue: boolean;
	queues: MusicQueue[];
}
