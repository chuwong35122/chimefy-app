import { SPACE_MUSIC_TYPES } from '$lib/constants/types';
import { z } from 'zod';

export const CreateSpaceSchema = z.object({
	is_private: z.boolean({
		required_error: "Space's privacvy is required!"
	}),
	type: z
		.string({
			required_error: 'Music type is required!'
		})
		.refine((val) => SPACE_MUSIC_TYPES.map((music) => music).includes(val)),
	name: z
		.string({
			required_error: 'Space name is required!'
		})
		.min(6, 'Space name is too short!')
		.max(50, 'Space name is too long!'),
	allow_member_queue: z
		.boolean({
			required_error: "Member's queue allowance is required!"
		})
		.default(true)
});
