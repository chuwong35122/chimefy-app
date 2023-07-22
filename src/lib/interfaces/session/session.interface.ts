import type { MusicSessionQueue } from './queue.interface';

export type MusicSessionRole = 'admin' | 'member';

export interface CreateMusicSession {
	id?: number;
	created_at?: Date;
	uuid?: string;
	name: string;
	is_private: boolean;
	type: string;
	queues: number | null;
	created_by: string;
	allow_member_queue: boolean;
}
export interface MusicSession {
	id?: number;
	uuid?: string;
	created_at?: Date;
	name: string;
	is_private: boolean;
	type: string;
	members: number | null;
	created_by: number | null;
	queue: number | null;
	allow_member_queue: boolean;
}

export interface MusicSessionInfo {
	id?: number;
	uuid?: string;
	created_at?: Date;
	name: string;
	is_private: boolean;
	type: string;
	session_queue: MusicSessionQueue[];
}

export type SessionBroadcastStatus = 'broadcasting' | 'waiting';
