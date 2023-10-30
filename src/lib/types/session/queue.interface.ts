import type { SearchType } from '$lib/types/spotify/track.interface';

export interface MusicQueue {
	playlist_id: string | null;
	added_since: Date;
	type: SearchType;
	id: string;
	uri: string;
	name: string;
	artist: string;
	duration_ms: number;
	image_url?: string;
	added_by: string; // member_user_id of SpaceMember
}

export interface MusicSpaceQueue {
	id?: string;
	updated_since?: Date;
	queues: MusicQueue[];
	session_id: number;
	session_uuid: string;
}
