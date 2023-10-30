export interface SpaceMember {
	joined_since: Date;
	display_name: string;
	member_user_id: string;
	is_admin: boolean;
	profile_img?: string;
}

export interface MusicSpaceMember {
	id?: number;
	session_id: number;
	session_uuid: string;
	members: SpaceMember[];
}
