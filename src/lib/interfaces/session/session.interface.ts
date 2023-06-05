import type { MusicQueue, MusicSessionQueue } from './queue.interface';

export type MusicSessionRole = 'admin' | 'member';

export interface CreateMusicSession {
	id?: number;
	created_at?: Date;
	uuid?: string;
	name: string;
	password: string | null;
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
	members: number | null;
	created_by: number | null;
	queue: number | null;
}

export interface MusicSessionInfo {
	id?: number;
	uuid?: string;
	created_at?: Date;
	name: string;
	password: string;
	is_private: boolean;
	type: string;
	session_queue: MusicSessionQueue[];
}

export type SessionBroadcastStatus = 'broadcasting' | 'waiting';
