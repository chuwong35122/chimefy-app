import { SPACE_MUSIC_TYPES } from '$lib/constants/types';
import { z } from 'zod';

export const CreateSpaceSchema = z.object({
	is_private: z.boolean({
		required_error: 'Privacy is required!'
	}),
	type: z
		.string({
			required_error: 'Music type is required!'
		})
		.refine((val) => SPACE_MUSIC_TYPES.map((music) => music).includes(val)),
	name: z
		.string({
			required_error: 'Name is required!'
		})
		.min(6, 'Name is too short!')
		.max(50, 'Name is too long!'),
	description: z.string().min(1, 'Description is required!').max(40, 'Description is too long!'),
	allow_member_queue: z
		.boolean({
			required_error: "Member's queue allowance is required!"
		})
		.default(true),
	cover_image: z
		.string()
		.url({ message: 'This is not a valid URL!' })
		.min(1, { message: 'Cover image is required' })
		.default('')
});
