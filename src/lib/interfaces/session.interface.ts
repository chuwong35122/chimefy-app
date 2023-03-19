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
	durationMinutes: number;
	durationSeconds: number;
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
	status: SessionStatus;
	trackId: string;
	trackDurationMinutes: number;
	trackDurationSeconds: number;
	currentDurationMinutes: number;
	currentDurationSeconds: number;
}