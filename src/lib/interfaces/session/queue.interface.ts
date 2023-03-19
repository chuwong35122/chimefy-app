import type { MusicSessionQueue, SessionJoinRequest } from './session.interface';

export interface SessionTrackQueueRequest extends SessionJoinRequest {
	track: MusicSessionQueue;
}
