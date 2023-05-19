export type MusicSessionRole = 'admin' | 'member';

export interface CreateMusicSession {
	id?: number;
	created_at?: Date;
	uuid?: string;
	name: string;
	password: string;
	is_private: boolean;
	type: string;
	is_playing: boolean;
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
	is_playing: boolean;
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

export interface CreateMusicSessionQueue {
	track_id: string;
	track_uri: string;
	track_name: string;
	artist: string;
	duration_ms: number;
	track_image_url?: string;
	added_by: string;
}

export interface MusicSessionQueue {
	id?: string;
	updated_since?: Date;
	session_id: number;
	session_uuid: string;
	track_id: string;
	track_uri: string;
	track_name: string;
	artist: string;
	duration_ms: number;
	track_image_url?: string;
	added_since: Date;
	added_by: MusicSessionMember;
}

export type SessionStatus = 'playing' | 'pause';
export type SessionBroadcastStatus = 'broadcasting' | 'waiting';
export interface SessionPlayingInfo extends MusicSessionQueue {
	status: SessionStatus;
	currentDurationMs: number;
}
