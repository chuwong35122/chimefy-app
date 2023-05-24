import type { SessionPlayingInfo } from '../session/session.interface';

export interface SocketPlayerBroadcastInfo {
	session_uuid: string | null;
	playing_info: SessionPlayingInfo | null;
}

export interface SocketJoinSessionRoom {
	session_uuid: string;
	user_id: string;
	session_name: string;
	display_name: string;
}
