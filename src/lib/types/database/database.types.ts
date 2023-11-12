export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			space: {
				Row: {
					allow_member_queue: boolean | null;
					cover_image: string | null;
					created_at: string | null;
					created_by: string | null;
					description: string | null;
					id: number;
					is_private: boolean | null;
					name: string | null;
					queues: Json[];
					type: string | null;
					uuid: string;
				};
				Insert: {
					allow_member_queue?: boolean | null;
					cover_image?: string | null;
					created_at?: string | null;
					created_by?: string | null;
					description?: string | null;
					id?: number;
					is_private?: boolean | null;
					name?: string | null;
					queues?: Json[];
					type?: string | null;
					uuid?: string;
				};
				Update: {
					allow_member_queue?: boolean | null;
					cover_image?: string | null;
					created_at?: string | null;
					created_by?: string | null;
					description?: string | null;
					id?: number;
					is_private?: boolean | null;
					name?: string | null;
					queues?: Json[];
					type?: string | null;
					uuid?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'space_created_by_fkey';
						columns: ['created_by'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			space_member: {
				Row: {
					id: number;
					members: Json[] | null;
					space_id: number;
					space_uuid: string | null;
					updated_since: string | null;
				};
				Insert: {
					id?: number;
					members?: Json[] | null;
					space_id: number;
					space_uuid?: string | null;
					updated_since?: string | null;
				};
				Update: {
					id?: number;
					members?: Json[] | null;
					space_id?: number;
					space_uuid?: string | null;
					updated_since?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'space_member_space_id_fkey';
						columns: ['space_id'];
						isOneToOne: false;
						referencedRelation: 'space';
						referencedColumns: ['id'];
					}
				];
			};
			user_configs: {
				Row: {
					config_owner: string | null;
					created_at: string;
					id: number;
					player_volume: number | null;
					session_refresh_redirect_url: string | null;
				};
				Insert: {
					config_owner?: string | null;
					created_at?: string;
					id?: number;
					player_volume?: number | null;
					session_refresh_redirect_url?: string | null;
				};
				Update: {
					config_owner?: string | null;
					created_at?: string;
					id?: number;
					player_volume?: number | null;
					session_refresh_redirect_url?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'user_configs_config_owner_fkey';
						columns: ['config_owner'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
