import { MUSIC_GENRE } from '$lib/constants/music/genres';
import { string, object, boolean } from 'yup';

export const CreateSessionSchema = object({
	isPrivate: boolean().required('isPrivate is required!'),
	type: string()
		.required('Music type is required!')
		.test({
			name: 'musicType',
			test: (val, ctx) => {
				if (!MUSIC_GENRE.includes(val)) {
					return ctx.createError({ message: 'Music genre is invalid!' });
				}
				return true;
			}
		}),
	password: string().when('isPrivate', {
		is: true,
		then: (schema) =>
			schema
				.required('Password is required!')
				.min(6, 'Password is too short!')
				.max(40, 'Password is too long!')
	}),
	name: string()
		.required('Session name is required!')
		.min(6, 'Session name is too short!')
		.max(50, 'Session name is too long!')
});
