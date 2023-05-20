import type { MusicQueue, MusicSessionQueue } from './queue.interface';

export type MusicSessionRole = 'admin' | 'member';

export interface CreateMusicSession {
	id?: number;
	created_at?: Date;
	uuid?: string;
	name: string;
	password: string;
	is_private: boolean;
	type: string;
	queues: number | null;
	created_by: string;
}
export interface MusicSession {
	id?: number;
	uuid?: string;
	created_at?: Date;
	name: string;
	password: string;
	is_private: boolean;
	type: string;
	members: MusicSessionMember[];
	created_by: MusicSessionMember;
	queue: {
		id?: number;
		updated_since?: Date;
		queues: MusicSessionQueue[];
		session_id: number;
	};
}
export interface MusicSessionMember {
	id?: number;
	joined_since?: Date;
	member_user_id: number;
	is_admin: boolean;
	session_id: number;
}

export type SessionBroadcastStatus = 'broadcasting' | 'waiting';
export interface SessionPlayingInfo extends MusicQueue {
	is_playing: boolean;
	currentDurationMs: number;
}
