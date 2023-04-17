import type {
	MusicSessionMember,
	MusicSessionQueue,
	SessionBroadcastStatus
} from './session.interface';

export interface InitRoomRequest {
	sessionId: string;
	name: string;
	isPrivate: boolean;
	participants: MusicSessionMember[];
	queues: MusicSessionQueue[];
	status: SessionBroadcastStatus;
}

export interface JoinSessionRequest {
	sessionId: string;
	spotifyId: string;
	spotifyDisplayName: string;
}
