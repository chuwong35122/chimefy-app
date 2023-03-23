export type MusicSessionRole = 'admin' | 'member';

export interface MusicSession {
	name: string;
	password: string;
	isPrivate: boolean;
	type: string;
	participants: MusicSessionMember[];
	queues: MusicSessionQueue[];
}
export interface MusicSessionMember {
	userId: string;
	role: MusicSessionRole;
	socketId?: string;
}

export interface MusicSessionQueue {
	trackId: string;
	trackName: string;
	artist: string;
	durationMs: number;
	trackImageUrl?: string;
	addedSince: Date;
}

export interface SessionJoinRequest {
	sessionId: string;
	userId: string;
	socketId: string;
	spotifyDisplayName: string;
}

export type SessionStatus = 'playing' | 'pause';
export interface SessionPlayingInfo {
	trackName: string;
	status: SessionStatus;
	trackId: string;
	artist: string;
	trackCoverImg?: string;
	trackDurationMs: number;
}