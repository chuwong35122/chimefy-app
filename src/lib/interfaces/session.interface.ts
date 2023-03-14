export interface MusicSession {
	name: string;
	password: string;
	isPrivate: boolean;
	type: string;
	participants: MusicSessionMember;
	queues: MusicSessionQueue[];
}
export interface MusicSessionMember {
	admins: string[];
	members: string[];
}

export interface MusicSessionQueue {
	trackId: string;
	addedSince: Date;
}
