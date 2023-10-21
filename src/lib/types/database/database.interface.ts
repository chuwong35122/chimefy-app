import type { SessionMember } from '$lib/types/session/member.interface';
import type { MusicSessionQueue } from '$lib/types/session/queue.interface';
import type { MusicSession } from '$lib/types/session/session.interface';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			session: {
				Row: {
					id: number;
					name: 'session';
					data: MusicSession;
				};
			};
			session_member: {
				Row: {
					id: number;
					name: 'session_member';
					data: SessionMember;
				};
			};
			session_queue: {
				Row: {
					id: number;
					name: 'session_queue';
					data: MusicSessionQueue;
				};
			};
		};
	};
}
