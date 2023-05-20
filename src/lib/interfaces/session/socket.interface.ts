import type { SessionPlayingInfo } from './session.interface';

export interface JoinSessionRequest {
	sessionId: number;
	spotifyId: string;
	spotifyDisplayName: string;
}

export interface SessionJoinRequest {
	sessionId: string;
	spotifyDisplayName: string;
}

export interface SessionBroadcastRequest extends SessionPlayingInfo {
	sessionId: string;
}

export interface PauseSessionBroadcastRequest {
	sessionId: string;
	status: boolean;
}
