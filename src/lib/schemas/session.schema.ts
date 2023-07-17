import { SESSION_MUSIC_TYPES } from '$lib/constants/types';
import { z } from 'zod';

export const CreateSessionSchema = z.object({
	is_private: z.boolean({
		required_error: "Session's privacvy is required!"
	}),
	type: z
		.string({
			required_error: 'Music type is required!'
		})
		.refine((val) => SESSION_MUSIC_TYPES.map((music) => music.name).includes(val)),
	name: z
		.string({
			required_error: 'Session name is required!'
		})
		.min(6, 'Session name is too short!')
		.max(50, 'Session name is too long!')
});