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
	spotifyDisplayedName: string;
	role: MusicSessionRole;
	profileImg: string | undefined;
}

export interface MusicSessionQueue {
	trackId: string;
	trackName: string;
	artist: string;
	durationMs: number;
	trackImageUrl?: string;
	addedSince: Date;
}

export type SessionStatus = 'playing' | 'pause';
export interface SessionPlayingInfo {
	trackName: string;
	status: SessionStatus;
	trackId: string;
	artist: string;
	trackCoverImg?: string;
	trackDurationMs: number;
	currentDurationMs: number;
}

export interface SessionJoinRequest {
	sessionId: string;
	userId: string;
	socketId: string;
	spotifyDisplayName: string;
	playingInfo: SessionPlayingInfo;
}

export interface SessionJoinResponse {
	spotifyDisplayName: string;
	playingInfo: SessionPlayingInfo;
}

export interface OnChangePlayingInfoRequest {
	sessionId: string;
	playingInfo: SessionPlayingInfo;
}
