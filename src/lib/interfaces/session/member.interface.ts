export interface SessionMember {
	joined_since: Date;
	display_name: string;
	member_user_id: string;
	is_admin: boolean;
	profile_img?: string;
}

export interface MusicSessionMember {
	id?: number;
	session_id: number;
	session_uuid: string;
	members: SessionMember[];
}