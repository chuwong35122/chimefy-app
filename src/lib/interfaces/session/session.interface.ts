export type MusicSessionRole = 'admin' | 'member';

export interface MusicSession {
	id?: number;
	created_at?: Date;
	uuid: string;
	name: string;
	password: string;
	isPrivate: boolean;
	type: string;
	participants: MusicSessionMember[];
	queues: MusicSessionQueue[];
	status: SessionBroadcastStatus;
}
export interface MusicSessionMember {
	userId: string;
	spotifyDisplayedName: string;
	role: MusicSessionRole;
	profileImg: string | undefined;
}

export interface MusicSessionQueue {
	trackId: string;
	trackUri: string;
	trackName: string;
	artist: string;
	durationMs: number;
	trackImageUrl?: string;
	addedSince: Date;
}

export type SessionStatus = 'playing' | 'pause';
export type SessionBroadcastStatus = 'broadcasting' | 'waiting';
export interface SessionPlayingInfo extends MusicSessionQueue {
	status: SessionStatus;
	currentDurationMs: number;
}