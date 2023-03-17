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
}

export interface MusicSessionQueue {
	trackId: string;
	trackImageUrl?: string;
	addedSince: Date;
}
