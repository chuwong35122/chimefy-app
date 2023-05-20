import type { MusicQueue, MusicSessionQueue } from './queue.interface';
import type { SessionMember } from './member.interface';

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
	members: SessionMember[];
	created_by: SessionMember;
	queue: {
		id?: number;
		updated_since?: Date;
		queues: MusicSessionQueue[];
		session_id: number;
	};
}

export type SessionBroadcastStatus = 'broadcasting' | 'waiting';
export interface SessionPlayingInfo extends MusicQueue {
	is_playing: boolean;
	currentDurationMs: number;
}
