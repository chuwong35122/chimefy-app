import type { MusicSessionMember } from './session.interface';

export interface MusicQueue {
	added_since: Date;
	track_id: string;
	track_uri: string;
	track_name: string;
	artist: string;
	duration_ms: number;
	track_image_url?: string;
	added_by: MusicSessionMember;
}
export interface MusicSessionQueue {
	id?: string;
	updated_since?: Date;
	queues: MusicQueue[];
	session_id: number;
	session_uuid: string;
}
