export interface MusicSession {
	name: string;
	password: string;
	isPrivate: boolean;
	type: string;
	participants: MusicSessionMember;
}

export interface MusicSessionMember {
	admins: string[];
	members: string[];
}
